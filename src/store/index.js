//import Web3 from "web3";
import Vuex from "vuex";
import Vue from "vue";
//import createPersistedState from "vuex-persistedstate";
import {
    getEtherscanAddress,
    getNetIdString,
}
from "@/utils/lookupTools";
import truffleContract from "truffle-contract";
  
import * as actions from "./actions";
import * as mutations from "./mutation-types";

import AlkemiNetworkABI from "../contracts/AlkemiNetwork.json";
import LiquidityReserveABI from "../contracts/LiquidityReserve.json";

const AlkemiNetwork = truffleContract(AlkemiNetworkABI);
const LiquidityReserve = truffleContract(LiquidityReserveABI);

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        web3: null,
        account: null,
        currentNetwork: null,
        etherscanBase: null,
        alkemiNetwork: null,
        liquidityReserves: null
    },
    mutations: {
        //WEB3 Stuff
        [mutations.SET_ACCOUNT](state, account) {
          console.log("Account set")
          console.log(account)
          state.account = account;
        },
        [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
          state.currentNetwork = currentNetwork;
        },
        [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
          state.etherscanBase = etherscanBase;
        },
        [mutations.SET_WEB3]: async function (state, web3) {
          state.web3 = web3;
        },
        [mutations.SET_ALKEMI_NETWORK]: async function (state, alkemiNetwork) {
          state.alkemiNetwork = alkemiNetwork;
        },
        [mutations.SET_LIQUIDITY_RESERVE]: async function (state, liquidityReserves) {
          state.liquidityReserves = liquidityReserves;
        },
        [mutations.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
          state.miningTransactionObject = miningTransactionObject;
        },
        [mutations.SET_WITHDRAW_EVENT_OBJECT](state, withdrawEventObject) {
          state.withdrawEventObject = withdrawEventObject;
        }
    },
    actions: {
      [actions.GET_CURRENT_NETWORK]: function ({
        commit,
      }) {
        getNetIdString().then(currentNetwork => {
          commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
        });
        getEtherscanAddress().then(etherscanBase => {
          commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
        });
      },
      [actions.INIT_APP]: async function ({
        commit,
        dispatch
      }, web3) {
        // Set the web3 instance
        AlkemiNetwork.setProvider(web3.currentProvider)
        console.log("IN STORE")
        console.log(web3)
        commit(mutations.SET_WEB3, {
          web3
        });
        console.log("set")
  
        dispatch(actions.GET_CURRENT_NETWORK);
  
        let accounts = await web3.eth.getAccounts();
        let account = accounts[0];
        if (account) {
          commit(mutations.SET_ACCOUNT, account);
        }
  
        let alkemiNetwork = await AlkemiNetwork.deployed();
        console.log("contract")
        console.log(alkemiNetwork)
  
        commit(mutations.SET_ALKEMI_NETWORK, alkemiNetwork);
      },
      [actions.LOAD_LIQUIDITY_RESERVES]: async function ({
        commit,
        state
      }) {
  
        console.log("fetching provider liquidity reserves");
        console.log(state.account);
    
        let reserves = await state.alkemiNetwork.providerLiquidityReserves(state.account, {
          from: state.account
        });
        console.log(reserves);
  
        commit(mutations.SET_LIQUIDITY_RESERVE, reserves);
      },
      [actions.CREATE_LIQUIDITY_RESERVE]: async function ({
        commit,
        dispatch,
        state
      }, params) {
  
        console.log("liquidity provider address");
        console.log(state.account);
  
        commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
          status: 'pending',
          txHash: ""
        });
  
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
          commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
            status: 'done',
            txHash: txHash.tx
          });
          
          dispatch(actions.LOAD_LIQUIDITY_RESERVES);
        }
      },
      [actions.CLAIM_LIQUIDITY_RESERVE]: async function ({
        commit,
        dispatch,
        state
      }, params) {
  
        console.log("liquidity provider address");
        console.log(state.account);

        console.log("liquidity reserve to claim");
        console.log(params.reserveAddress);
  
        commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
          status: 'pending',
          txHash: ""
        });

        let liquidityReserve = await LiquidityReserve.at(params.reserveAddress);
  
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
          commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
            status: 'done',
            txHash: txHash.tx
          });
          
          liquidityReserve.once('ReserveWithdraw', {
            fromBlock: 0
          }, function(error, event){ 
            console.log(event); 
          });
        
          dispatch(actions.LOAD_LIQUIDITY_RESERVES);
        }
      }
    }    
});
