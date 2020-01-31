import { getEtherscanAddress, getNetIdString } from "@/utils/lookupTools";
import truffleContract from "truffle-contract";
import * as actionType from "../ActionTypes";
import * as mutationType from "../MutationType";
import AlkemiNetworkABI from "../../contracts/AlkemiNetwork.json";
import LiquidityReserveABI from "../../contracts/LiquidityReserve.json";
import ERC20ABI from "../../contracts/ERC20.json";
import axios from "axios";

const AlkemiNetwork = truffleContract(AlkemiNetworkABI);
const LiquidityReserve = truffleContract(LiquidityReserveABI);
const ERC20Token = truffleContract(ERC20ABI);

const state = {
  web3: null,
  account: null,
  currentNetwork: null,
  etherscanBase: null,
  alkemiNetwork: null,
  providerLiquidityReserves: null,
  tokenBalance: null,
  providerReservesDetails: [],
  tokenLiquidityReserves: [],
  providerTokenLiquidityReserves: [],
  unitCoin: "USD",
  priceCoin: {},
  miningTransactionObject: {
    status: null,
    txHash: ""
  }
};

const getters = {};

const actions = {
  [actionType.GET_PRICE_COIN]: function({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      axios(`https://market-data.alkemi.tech/exchange/bitfinex2/ticker`, {
        method: "GET",
        params: { symbol: `${params.name}/${state.unitCoin}` },
        headers: {
          Accept: "application/json"
        }
      })
        .then(result => {
          if (!state.priceCoin[result.data.symbol]) {
            commit(mutationType.SET_PRICE_COIN, result.data);
          }
          resolve(result);
        })
        .catch(error => reject(error));
    });
  },

  [actionType.GET_CURRENT_NETWORK]: function({ commit }) {
    getNetIdString().then(currentNetwork => {
      commit(mutationType.SET_CURRENT_NETWORK, currentNetwork);
    });
    getEtherscanAddress().then(etherscanBase => {
      commit(mutationType.SET_ETHERSCAN_NETWORK, etherscanBase);
    });
  },
  [actionType.INIT_APP]: async function({ commit, dispatch }, web3) {
    // Set the web3 instance
    AlkemiNetwork.setProvider(web3.currentProvider);
    console.log("IN STORE");
    console.log(web3);
    commit(mutationType.SET_WEB3, {
      web3
    });
    console.log("set");

    dispatch(actionType.GET_CURRENT_NETWORK);

    let accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    if (account) {
      commit(mutationType.SET_ACCOUNT, account);
    }

    let alkemiNetwork = await AlkemiNetwork.deployed();
    console.log("contract");
    console.log(alkemiNetwork);

    commit(mutationType.SET_ALKEMI_NETWORK, alkemiNetwork);
  },
  [actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES]: async function({
    commit,
    state
  }) {
    console.log("fetching provider liquidity reserves");
    console.log(state.account);

    let reserves = await state.alkemiNetwork.providerLiquidityReserves(
      state.account,
      {
        from: state.account
      }
    );

    for (let i = 0; i < reserves.length; i++) {      
      if(reserves[i] == "0x0000000000000000000000000000000000000000") {
        reserves.splice(i);
      }
    }

    commit(mutationType.SET_PROVIDER_LIQUIDITY_RESERVE, reserves);
  },
  [actionType.CREATE_LIQUIDITY_RESERVE]: async function(
    { commit, dispatch, state },
    params
  ) {
    console.log("liquidity provider address");
    console.log(state.account);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    try {
      let latest = await params.web3.eth.getBlockNumber();

      let txHash = await state.alkemiNetwork.createLiquidityReserve(
        params.linkToken,
        params.beneficiary,
        params.erc20Token,
        params.createdAt,
        params.lockingPeriod,
        params.lockingPrice,
        params.lockingPricePosition,
        { from: state.account }
      );
      if (txHash) {
        commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
          status: "done",
          txHash: txHash.tx
        });

        state.alkemiNetwork.contract.events.ReserveCreate(
          {
            filter: {
              liquidityProvider: state.account
            },
            fromBlock: latest
          },
          function(error, event) {
            console.log(event);
            if (params.erc20Token != "0x0000000000000000000000000000000000000000") {
              // dispatch approve token action
              dispatch(actionType.APPROVE_TOKEN_DEPOSIT, {
                web3: params.web3,
                erc20: params.erc20Token,
                spender: event.returnValues[0],
                amount: params.depositAmount
              });
            }
            else {
              dispatch(actionType.DEPOSIT_ETH_LIQUIDITY, {
                web3: params.web3,
                reserveAddress: event.returnValues[0],
                amount: params.depositAmount
              });
            }
          }
        );
      }
    }
    catch(err) {
      console.log(err);
      dispatch(actionType.CLOSE_MINING_DIALOG);
    }
  },
  [actionType.CLAIM_LIQUIDITY_RESERVE]: async function(
    { commit, dispatch, state },
    params
  ) {
    console.log(params.web3.currentProvider);
    LiquidityReserve.setProvider(params.web3.currentProvider);

    console.log("liquidity provider address");
    console.log(state.account);

    console.log("liquidity reserve to claim");
    console.log(params.reserveAddress);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    try {
      let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);

      let latest = await params.web3.eth.getBlockNumber();

      let txHash = await liquidityReserve.withdraw(
        params.amount,
        params.oracle,
        params.jobId,
        params.tokenSymbol,
        params.market,
        params.oraclePayment,
        { 
          gasLimit: 750000,
          from: state.account 
        }
      );
      if (txHash) {
        commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
          status: "done",
          txHash: txHash.tx
        });
        dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);

        liquidityReserve.contract.events.ReserveWithdraw(
          {
            filter: {
              withdrawer: state.account
            },
            fromBlock: latest
          },
          function(error, event) {
            console.log("reserve withdraw event");
            console.log(event);
            // alert of withdraw 
          }
        );

        liquidityReserve.contract.events.PriceUnlock(
          {
            fromBlock: latest
          },
          function(error, event) {
            console.log("price unlocking event");
            console.log(event);
            // alert of price unlocking

            dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);
          }
        );
      }
    } catch(err){
      console.log(err);
      dispatch(actionType.CLOSE_MINING_DIALOG);
    }
  },
  [actionType.APPROVE_TOKEN_DEPOSIT]: async function(
    { commit, dispatch, state },
    params
  ) {
    ERC20Token.setProvider(params.web3.currentProvider);

    console.log("approving token transfer from provider to AlkemiNetwork");
    console.log(params.erc20);
    console.log(state.account);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    let erc20Token = await ERC20Token.at(params.erc20);
    console.log(erc20Token);

    let txHash = await erc20Token.approve(params.spender, params.amount, {
      from: state.account,
      gasLimit: 750000
    });

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: "done",
        txHash: txHash.tx
      });

      dispatch(actionType.DEPOSIT_TOKEN_LIQUIDITY, {
        web3: params.web3,
        reserveAddress: params.spender,
        amount: params.amount
      });
    }
  },
  [actionType.GET_TOKEN_BALANCE]: async function({ commit, state }, params) {
    ERC20Token.setProvider(params.web3.currentProvider);

    console.log("getting user token balance");
    console.log(state.account);
    console.log(params.erc20);

    if (params.erc20 != "0x0000000000000000000000000000000000000000") {
      let erc20Token = await ERC20Token.at(params.erc20);
      console.log(erc20Token);

      let txHash = await erc20Token.balanceOf(state.account, {
        from: state.account
      });

      if (txHash) {
        if(params.erc20 == "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b") {
          commit(
            mutationType.SET_TOKEN_BALANCE,
            params.web3.utils.fromWei(txHash, "ether") * 10**12
          );
        }
        else {
          commit(
            mutationType.SET_TOKEN_BALANCE,
            params.web3.utils.fromWei(txHash, "ether")
          );
        }
      }
    }
    else {
      let balance = await params.web3.eth.getBalance(state.account);
      commit(
        mutationType.SET_TOKEN_BALANCE,
        params.web3.utils.fromWei(balance, "ether")
      );
    }
    
  },
  [actionType.DEPOSIT_TOKEN_LIQUIDITY]: async function(
    { commit, dispatch, state },
    params
  ) {
    console.log(params.web3.currentProvider);
    LiquidityReserve.setProvider(params.web3.currentProvider);

    console.log("liquidity provider address");
    console.log(state.account);

    console.log("liquidity reserve to deposit into");
    console.log(params.reserveAddress);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    try {
      let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);
      let txHash = await liquidityReserve.deposit(params.amount, {
        from: state.account,
        gasLimit: 750000
      });
      if (txHash) {
        commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
          status: "done",
          txHash: txHash.tx
        });
        dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);
      }
    }
    catch(err) {
      console.log(err);
    }
  },
  [actionType.DEPOSIT_ETH_LIQUIDITY]: async function(
    { commit, dispatch, state },
    params
  ) {
    console.log(params.web3.currentProvider);
    LiquidityReserve.setProvider(params.web3.currentProvider);

    console.log("liquidity provider address");
    console.log(state.account);

    console.log("liquidity reserve to deposit into");
    console.log(params.reserveAddress);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    try {
      let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);
      let txHash = await liquidityReserve.deposit(params.amount, {
        from: state.account,
        gasLimit: 750000,
        value: params.amount
      });
      if (txHash) {
        commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
          status: "done",
          txHash: txHash.tx
        });
        dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);
      }
    }
    catch(err) {
      console.log(err);
    }
  },
  [actionType.LOAD_TOKEN_LIQUIDITY_RESERVES]: async function ({
    commit,
    state
  }, params) {
    let reserves = await state.alkemiNetwork.tokenLiquidityReserves(params.erc20, {
      from: state.account
    });
    commit(mutationType.SET_TOKEN_LIQUIDITY_RESERVE, reserves);
  },
  [actionType.GET_RESERVE_DETAILS]: async function ({
    commit,
    state
  }, params) {
    LiquidityReserve.setProvider(params.web3.currentProvider);

    let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);

    let txHash = await liquidityReserve.details({
      from: state.account
    });
    if (txHash) {
      if(params.erc20 == "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b") {
        commit(mutationType.SET_PROVIDER_RESERVE_DETAILS, {
          asset: txHash[0],
          beneficiary: txHash[1],
          createdAt: txHash[2],
          lockingPeriod: txHash[3],
          lockingPrice: params.web3.utils.fromWei(txHash[4], "ether"),
          lockingPricePosition: txHash[5],
          totalBalance: params.web3.utils.fromWei(txHash[6], "ether") * 10**12,
          deposited: params.web3.utils.fromWei(txHash[7], "ether") * 10**12,
          earned: params.web3.utils.fromWei(txHash[8], "ether") * 10**12
        });
        }
      else {
        commit(mutationType.SET_PROVIDER_RESERVE_DETAILS, {
          asset: txHash[0],
          beneficiary: txHash[1],
          createdAt: txHash[2],
          lockingPeriod: txHash[3],
          lockingPrice: params.web3.utils.fromWei(txHash[4], "ether"),
          lockingPricePosition: txHash[5],
          totalBalance: params.web3.utils.fromWei(txHash[6], "ether"),
          deposited: params.web3.utils.fromWei(txHash[7], "ether"),
          earned: params.web3.utils.fromWei(txHash[8], "ether")
        });
        }
    }
  },
  [actionType.CLOSE_MINING_DIALOG]: async function ({
    commit,
  }) {
    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: null,
      txHash: ""
    });
  }
};

const mutations = {
  //WEB3 Stuff
  [mutationType.SET_PRICE_COIN](state, unitCoin) {
    state.priceCoin[unitCoin.symbol] = unitCoin.last;
  },
  [mutationType.SET_ACCOUNT](state, account) {
    console.log("Account set");
    console.log(account);
    state.account = account;
  },
  [mutationType.SET_CURRENT_NETWORK](state, currentNetwork) {
    state.currentNetwork = currentNetwork;
  },
  [mutationType.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
    state.etherscanBase = etherscanBase;
  },
  [mutationType.SET_WEB3]: async function(state, web3) {
    state.web3 = web3;
  },
  [mutationType.SET_ALKEMI_NETWORK]: async function(state, alkemiNetwork) {
    state.alkemiNetwork = alkemiNetwork;
  },
  [mutationType.SET_PROVIDER_LIQUIDITY_RESERVE]: async function(
    state,
    providerLiquidityReserves
  ) {
    state.providerLiquidityReserves = providerLiquidityReserves;
  },
  [mutationType.SET_PROVIDER_RESERVE_DETAILS]: async function(
    state,
    providerReserveDetails
  ) {
    state.providerReservesDetails.push(providerReserveDetails);
  },
  [mutationType.SET_TOKEN_LIQUIDITY_RESERVE]: async function(
    state,
    tokenLiquidityReserves
  ) {
    state.tokenLiquidityReserves.push(tokenLiquidityReserves);
  },
  [mutationType.SET_EMPTY_PROVIDER_RESERVE_DETAILS]: async function(
    state
  ) {
    state.providerReservesDetails = [];
  },
  [mutationType.SET_TOKEN_BALANCE]: async function (state, tokenBalance) {
    state.tokenBalance = tokenBalance;
  },
  [mutationType.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
    state.miningTransactionObject = miningTransactionObject;
  },
  [mutationType.SET_WITHDRAW_EVENT_OBJECT](state, withdrawEventObject) {
    state.withdrawEventObject = withdrawEventObject;
  }  
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
