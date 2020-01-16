import { getEtherscanAddress, getNetIdString } from "@/utils/lookupTools";
import truffleContract from "truffle-contract";
import * as actionType from "../ActionTypes";
import * as mutationType from "../MutationType";
import AlkemiNetworkABI from "../../contracts/AlkemiNetwork.json";
import LiquidityReserveABI from "../../contracts/LiquidityReserve.json";
import ERC20ABI from "../../contracts/ERC20.json";

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
  tokenLiquidityReserves: [],
  miningTransactionObject: {
    status: null,
    txHash: ''
  }
};

const getters = {};

const actions = {
  [actionType.GET_CURRENT_NETWORK]: function ({
    commit,
  }) {
    getNetIdString().then(currentNetwork => {
      commit(mutationType.SET_CURRENT_NETWORK, currentNetwork);
    });
    getEtherscanAddress().then(etherscanBase => {
      commit(mutationType.SET_ETHERSCAN_NETWORK, etherscanBase);
    });
  },
  [actionType.INIT_APP]: async function ({
    commit,
    dispatch
  }, web3) {
    // Set the web3 instance
    AlkemiNetwork.setProvider(web3.currentProvider)
    console.log("IN STORE")
    console.log(web3)
    commit(mutationType.SET_WEB3, {
      web3
    });
    console.log("set")

    dispatch(actionType.GET_CURRENT_NETWORK);

    let accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    if (account) {
      commit(mutationType.SET_ACCOUNT, account);
    }

    let alkemiNetwork = await AlkemiNetwork.deployed();
    console.log("contract")
    console.log(alkemiNetwork)

    commit(mutationType.SET_ALKEMI_NETWORK, alkemiNetwork);
  },
  [actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES]: async function ({
    commit,
    state
  }) {

    console.log("fetching provider liquidity reserves");
    console.log(state.account);

    let reserves = await state.alkemiNetwork.providerLiquidityReserves(state.account, {
      from: state.account
    });
    console.log(reserves);

    commit(mutationType.SET_PROVIDER_LIQUIDITY_RESERVE, reserves);
  },
  [actionType.CREATE_LIQUIDITY_RESERVE]: async function ({
    commit,
    dispatch,
    state
  }, params) {

    console.log("liquidity provider address");
    console.log(state.account);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: 'pending',
      txHash: ""
    });

    let latest = await params.web3.eth.getBlockNumber();

    let txHash = await state.alkemiNetwork.createLiquidityReserve(
      params.linkToken,
      params.beneficiary,
      params.erc20Token,
      params.lockingPeriod,
      params.lockingPrice,
      params.lockingPricePosition,
      { from: state.account }
    );

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: 'done',
        txHash: txHash.tx
      });

      state.alkemiNetwork.contract.events.ReserveCreate({
        filter: {
          liquidityProvider: state.account
        },
        fromBlock: latest
      }, function(error, event){ 
        console.log(event); 
        // dispatch approve token action
        dispatch(actionType.APPROVE_TOKEN_DEPOSIT, {
          web3: params.web3,
          erc20: params.erc20Token,
          spender: event.returnValues[0],
          amount: params.depositAmount
        });
      });      
    }
  },
  [actionType.CLAIM_LIQUIDITY_RESERVE]: async function ({
    commit,
    dispatch,
    state
  }, params) {
    console.log(params.web3.currentProvider);
    LiquidityReserve.setProvider(params.web3.currentProvider);

    console.log("liquidity provider address");
    console.log(state.account);

    console.log("liquidity reserve to claim");
    console.log(params.reserveAddress);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: 'pending',
      txHash: ""
    });

    let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);

    let latest = await params.web3.eth.getBlockNumber();

    let txHash = await liquidityReserve.withdraw(
      params.amount,
      params.oracle,
      params.jobId,
      params.tokenSymbol,
      params.market,
      params.oraclePayment,
      { from: state.account }
    );

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: 'done',
        txHash: txHash.tx
      });
      
      liquidityReserve.contract.events.ReserveWithdraw({
        filter: {
          withdrawer: state.account
        },
        fromBlock: latest
      }, function(error, event){ 
        console.log(event);
        // alert of withdraw 
      });
    
      dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);
    }
  },
  [actionType.APPROVE_TOKEN_DEPOSIT]: async function ({
    commit,
    dispatch,
    state
  }, params) {
    ERC20Token.setProvider(params.web3.currentProvider);

    console.log("approving token transfer from provider to AlkemiNetwork");
    console.log(params.erc20);
    console.log(state.account);

    let erc20Token = await ERC20Token.at(params.erc20);
    console.log(erc20Token);

    let txHash = await erc20Token.approve(
      params.spender,
      params.amount,
      { from: state.account }
    );

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: 'done',
        txHash: txHash.tx
      });

      dispatch(actionType.DEPOSIT_LIQUIDITY, {
        web3: params.web3,
        reserveAddress: params.spender,
        amount: params.amount
      });

    }
  },
  [actionType.DEPOSIT_LIQUIDITY]: async function ({
    commit,
    state
  }, params) {
    console.log(params.web3.currentProvider);
    LiquidityReserve.setProvider(params.web3.currentProvider);

    console.log("liquidity provider address");
    console.log(state.account);

    console.log("liquidity reserve to deposit into");
    console.log(params.reserveAddress);

    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: 'pending',
      txHash: ""
    });

    let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);

    let txHash = await liquidityReserve.deposit(
      params.amount,
      { 
        from: state.account,
        gasLimit: 750000
      }
    );

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: 'done',
        txHash: txHash.tx
      });

      dispatch(actionType.LOAD_PROVIDER_LIQUIDITY_RESERVES);
    }
  },
  [actionType.LOAD_TOKEN_LIQUIDITY_RESERVES]: async function ({
    commit,
    state
  }, params) {

    console.log("fetching token liquidity reserves");
    console.log(params.erc20);

    let reserves = await state.alkemiNetwork.tokenLiquidityReserves(params.erc20, {
      from: state.account
    });
    console.log(reserves);

    commit(mutationType.SET_TOKEN_LIQUIDITY_RESERVE, reserves);
  }
};

const mutations = {
  //WEB3 Stuff
  [mutationType.SET_ACCOUNT](state, account) {
    console.log("Account set")
    console.log(account)
    state.account = account;
  },
  [mutationType.SET_CURRENT_NETWORK](state, currentNetwork) {
    state.currentNetwork = currentNetwork;
  },
  [mutationType.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
    state.etherscanBase = etherscanBase;
  },
  [mutationType.SET_WEB3]: async function (state, web3) {
    state.web3 = web3;
  },
  [mutationType.SET_ALKEMI_NETWORK]: async function (state, alkemiNetwork) {
    state.alkemiNetwork = alkemiNetwork;
  },
  [mutationType.SET_PROVIDER_LIQUIDITY_RESERVE]: async function (state, providerLiquidityReserves) {
    state.providerLiquidityReserves = providerLiquidityReserves;
  },
  [mutationType.SET_TOKEN_LIQUIDITY_RESERVE]: async function (state, tokenLiquidityReserves) {
    state.tokenLiquidityReserves.push(tokenLiquidityReserves);
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
