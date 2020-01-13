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
//import LiquidityReserve from "../contracts/LiquidityReserve.json";

const AlkemiNetwork = truffleContract(AlkemiNetworkABI);

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        web3: null,
        account: null,
        currentNetwork: null,
        etherscanBase: null,
        alkemiNetwork: null,
        liquidityReserve: null
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
        [mutations.SET_LIQUIDITY_RESERVE]: async function (state, liquidityReserve) {
          state.liquidityReserve = liquidityReserve;
        },
        [mutations.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
          state.miningTransactionObject = miningTransactionObject;
        },
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
  
        commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
          status: 'pending',
          txHash: ""
        });
  
        let txHash = await state.alkemiNetwork.providerLiquidityReserves(state.account, {
          from: state.account
        });
        console.log(txHash);
  
        if (txHash) {
          commit(mutations.SET_MINING_TRANSACTION_OBJECT, {
            status: 'done',
            txHash: txHash.tx
          });
        }
      },
      [actions.CREATE_LIQUIDITY_RESERVE]: async function ({
        commit,
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
        }
      }
    }    
});
