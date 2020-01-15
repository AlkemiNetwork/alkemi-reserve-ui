import { getEtherscanAddress, getNetIdString } from "@/utils/lookupTools";
import truffleContract from "truffle-contract";
import * as actionType from "../ActionTypes";
import * as mutationType from "../MutationType";
import AlkemiNetworkABI from "../../contracts/AlkemiNetwork.json";
const AlkemiNetwork = truffleContract(AlkemiNetworkABI);

const state = {
  web3: null,
  account: null,
  currentNetwork: null,
  etherscanBase: null,
  alkemiNetwork: null,
  liquidityReserve: null
};

const getters = {};

const actions = {
  [actionType.GET_CURRENT_NETWORK]: function({ commit }) {
    getNetIdString().then(currentNetwork => {
      commit(mutationType.SET_CURRENT_NETWORK, currentNetwork);
    });
    getEtherscanAddress().then(etherscanBase => {
      commit(mutationType.SET_ETHERSCAN_NETWORK, etherscanBase);
    });
  },
  [actionType.INIT_APP]: async function({ commit, dispatch }, web3) {
    AlkemiNetwork.setProvider(web3.currentProvider);

    commit(mutationType.SET_WEB3, {
      web3
    });

    dispatch(actionType.GET_CURRENT_NETWORK);

    let accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    if (account) {
      commit(mutationType.SET_ACCOUNT, account);
    }

    let alkemiNetwork = await AlkemiNetwork.deployed();
    commit(mutationType.SET_ALKEMI_NETWORK, alkemiNetwork);
  },
  [actionType.LOAD_LIQUIDITY_RESERVES]: async function({ commit, state }) {
    commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
      status: "pending",
      txHash: ""
    });

    let txHash = await state.alkemiNetwork.providerLiquidityReserves(
      state.account,
      {
        from: state.account
      }
    );

    if (txHash) {
      commit(mutationType.SET_MINING_TRANSACTION_OBJECT, {
        status: "done",
        txHash: txHash.tx
      });
    }
  }
};

const mutations = {
  //WEB3 Stuff
  [mutationType.SET_ACCOUNT](state, account) {
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
  [mutationType.SET_LIQUIDITY_RESERVE]: async function(
    state,
    liquidityReserve
  ) {
    state.liquidityReserve = liquidityReserve;
  },
  [mutationType.SET_MINING_TRANSACTION_OBJECT](state, miningTransactionObject) {
    state.miningTransactionObject = miningTransactionObject;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
