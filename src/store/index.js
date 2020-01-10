import Web3 from "web3";
import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import {
    getEtherscanAddress,
    getNetIdString,
}
from "@/utils/lookupTools";
import truffleContract from "truffle-contract";
  
import * as actions from "./actions";
import * as mutations from "./mutation-types";

import AlkemiNetworkABI from "../contracts/AlkemiNetwork.json";
import LiquidityReserve from "../contracts/LiquidityReserve.json";

const AlkemiNetwork = truffleContract(AlkemiNetworkABI);

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        web3: null,
        account: null,
        currentNetwork: null,
        etherscanBase: null,
        alkeminetwork: null
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
        [mutations.SET_ALKEMI_NETWORK]: async function (state, alkeminetwork) {
          state.alkeminetwork = alkeminetwork;
        },
        [mutations.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
          state.miningTransactionObject = miningTransactionObject;
        },
    },
    actions: {
    }    
});
