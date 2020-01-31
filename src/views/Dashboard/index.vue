<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col lg="12">
          <b-row class="head d-flex align-items-center">
            <b-col md="6">
              <div class="float-left banner-logo">
                <b-img
                  src="img/alkemi-logo-horizontal-all-white.svg"
                  alt="Alkemi"
                ></b-img>
                <span class="vertical-line"> | </span>
                <span class="cl-text-banner">Liquidity Reserve Dashboard</span>
              </div>
            </b-col>
            <b-col md="6">
              <div class="float-right pr-35">
                <b-button-group v-if="!isConnect">
                  <b-button @click="connectWallet" variant="akm">
                    Connect
                  </b-button>
                </b-button-group>
                <div
                  v-if="isConnect"
                  class="d-flex flex-row-reverse bd-highlight"
                >
                  <div class="p-2 bd-highlight bg-dark wallet-address ">
                    <div class="text-white">{{ addressWallet }}</div>
                  </div>
                  <div class="p-2 bd-highlight bg-dark wallet-name">
                    <div class="text-white">
                      <svg
                        class="bi bi-circle-fill"
                        width="8px"
                        height="8px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="8"
                          style="color:#14DC94"
                        ></circle>
                      </svg>
                      METAMASK
                    </div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="12">
          <b-row>
            <b-container fluid class="body-content">
              <b-row>
                <b-col md="2" class="pdr-0 pt-15">
                  <div class="est-content">
                    <div class="title-es-content">EST PORTFOLIO USD VALUE:</div>
                    <div class="monney">{{ estPortfolio + estEarnings | formatMoney }}</div>
                  </div>
                  <div class="est-content">
                    <div class="title-es-content">EST USD EARNINGS 24 hr:</div>
                    <div class="monney mb-20">{{ estEarnings | formatMoney }}</div>
                    <div class="title-es-content">CHANGE 24hr:</div>
                    <div v-if="(estPortfolio + estEarnings) != 0" class="change-number">+{{ (totalChange24h * 100) / (estPortfolio + estEarnings) | formatPercent }}</div>
                    <div v-else class="change-number">+{{ totalChange24h | formatPercent}}</div>
                  </div>
                  <div class="est-content">
                    <div class="float-left mr-30">
                      <div class="title-es-content">POOLS</div>
                      <div class="monney">{{ this.poolsCounter }}</div>
                    </div>
                    <div>
                      <div class="title-es-content">RESERVES</div>
                      <div class="monney">{{ this.reservesCounter }}</div>
                    </div>
                  </div>
                </b-col>
                <b-col md="10">
                  <div>
                    <b-card no-body>
                      <b-tabs pills card vertical>
                        <b-tab
                          @click="selectWallet(item)"
                          v-for="(item, key) in data"
                          :key="key"
                        >
                          <template v-slot:title>
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img :src="'/img/' + item.image"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                {{ item.name }}
                                <div class="name-el-money">
                                  {{ item.fullName }}
                                </div>
                              </div>
                              <div class="content-mid">
                                {{ item.total }}
                                <div class="cost">{{ item.estUSD | formatMoney }}</div>
                              </div>
                              <div class="content-mid">
                                {{ item.change24h }}
                                <span class="percent" v-if="item.total != 0"
                                  >{{
                                    (item.change24h * 100) / item.total
                                  }}%</span
                                >
                                <span class="percent" v-if="item.total == 0"
                                  >{{ item.total }}%</span
                                >
                                <div class="cost">
                                  ${{ item.estFluctuation }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">
                                    {{ item.total }}
                                  </div>
                                  <span class="acronym-name">
                                    {{ item.name }}
                                    <span class="line-vertical-14">|</span>
                                    <span class="el-name">
                                      {{ item.fullName }}
                                    </span>
                                  </span>
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    {{ item.estUSD | formatMoney }}
                                    <span class="line-vertical-14">|</span>
                                    <span class="text-est">
                                      EST USD VALUE
                                    </span>
                                  </div>
                                </div>
                                <div class="chart-line">
                                  <div class="info-chart">
                                    <div class="value-change float-left">
                                      24 HR CHANGE
                                      <div
                                        class="percent"
                                        v-if="item.total != 0"
                                      >
                                        +{{
                                          (item.change24h * 100) / item.total
                                        }}%
                                      </div>
                                      <div
                                        class="percent"
                                        v-if="item.total == 0"
                                      >
                                        +{{ item.total }}%
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        {{ item.assetEarning }}
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        $0.00
                                      </div>
                                    </div>
                                  </div>
                                  <div class="clearfix"></div>
                                  <chart
                                    auto-resize
                                    :options="chartOptionsLine"
                                  ></chart>
                                </div>
                                <div class="form-reserve">
                                  <div class="float-left">POOL RESERVES</div>
                                  <div class="float-right">
                                    <b-button
                                      variant="add-new"
                                      @click="showModal"
                                    >
                                      + Add New
                                    </b-button>
                                  </div>
                                  <b-table
                                    fixed
                                    :items="item.providerReserves"
                                    :fields="fields"
                                  >
                                    <template v-slot:cell(lockingPeriod)="row">
                                      <div class="value-change float-left">
                                        {{
                                          timestampToDate(
                                            row.item.lockingPeriod.toNumber()
                                          ) | formatDate
                                        }}
                                      
                                      </div>
                                    </template>
                                      <template v-slot:cell(createdAt)="row">
                                      <div class="value-change float-left">
                                        {{
                                          timestampToDate(
                                            row.item.createdAt.toNumber()
                                          ) | formatDate
                                        }}
                                      </div>
                                    </template>
                                    <template v-slot:cell(earned)="row">
                                      <div class="value-change float-left pdr-10">
                                        + {{ row.item.earned }}

                                      </div>
                                     <div
                                        class="value-change float-left percent"
                                      >
                                        {{
                                          row.item.earned > 0
                                            ? (row.item.earned * 100) /
                                              row.item.totalBalance
                                            : 0
                                        }}
                                        %
                                      </div>
                                    </template>
                                    <template v-slot:cell(deposited)="row">
                                      <div class="value-change float-left pdr-10">
                                      {{ row.item.deposited }} {{selectedAsset.name}}
                                      </div>
                                    </template>
                                    <template v-slot:cell(lockingPrice)="row">
                                      <div class="value-change float-left">
                                        {{row.item.lockingPricePosition.toNumber() ? '+' : '-'}}
                                        {{ row.item.lockingPrice | formatMoney }}
                                      </div>
                                    </template>
                                    <template v-slot:cell(est_USD_value)="row">
                                      <div class="value-change float-left">
                                        {{
                                          (row.item.deposited > 0 &&
                                          priceCoin[
                                            `${item.name}/${unitCoin}`
                                          ]
                                            ? row.item.deposited *
                                              priceCoin[
                                                `${item.name}/${unitCoin}`
                                              ]
                                            : 0)
                                          | formatMoney
                                        }}
                                      </div>
                                    </template>
                                    <template v-slot:cell(btn)="row">
                                      <b-button
                                        size="sm"
                                        class="btn-claim float-right"
                                        @click="showModalClaim(row.item)"
                                      >
                                        CLAIM
                                      </b-button>
                                    </template>
                                  </b-table>
                                </div>
                              </div>
                            </template>
                          </b-card-text>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <div class="version">Version: {{ version }}</div>
    <b-modal
      hide-footer
      hide-header
      centered
      ref="modal-add-new"
      title="Using Component Methods"
      id="modal-add"
    >
      <div class="head-modal">
        <b-img src="/img/dai.svg"></b-img>
        <span class="title-popup">
          ADD {{ selectedAsset ? selectedAsset.name : "" }} POOL
        </span>
      </div>
      <div class="content-modal">
        <b-form v-if="isShow == 'form-add'">
          <b-form-group
            class="text-label text-left"
            :label="`AVAILABLE ${selectedAsset ? selectedAsset.name : ''} BALANCE`"
            label-for="walletAssetBalance"
          >
            <b-form-input
              class="value-available"
              type="text"
              v-model="tokenBalance"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group
            class="text-label text-left input-rlt"
            label="ENTER FUNDING AMOUNT"
            label-for="fundingAmount"
          >
            <b-form-input
              v-model="amountToDeposit"
              class="enter-money"
              type="text"
              placeholder="0.00"
            >
            </b-form-input>
            <b-button @click="maxAvailable" class="btn-position">
              MAX
            </b-button>
          </b-form-group>
          <b-form-group
            class="text-label text-left"
            label="SELECT UNLOCK DATE"
            label-for="unclockDate"
          >
            <div class="choose-date" @click="showCalendar">
              <input type="text" v-model="unclockDate" disabled />
              <b-img src="/img/arrow-down-sign-to-navigate.png"></b-img>
            </div>
          </b-form-group>
          <b-form-group
            class="text-label text-left lock-price"
            label="ENTER USD LIQIUDATION PRICE"
            label-for="fundingAmount"
          >
            <div class="select-relative w-50">
              <b-form-select
                v-model="lockPricePosition"
                :options="options"
                class="enter-money float-left"
              >
              </b-form-select>
              <b-img src="/img/arrow-down-sign-to-navigate.png"></b-img>
            </div>
            <b-form-input
              v-model="lockPrice"
              class="enter-money w-50 float-left"
              type="text"
              placeholder="$ 0.00"
            >
            </b-form-input>
          </b-form-group>
          <b-button
            class="btn-submit"
            v-bind:class="{
              'btn-modal-add-new': amountToDeposit && unclockDate,
              'btn-modal-disable': !amountToDeposit || !unclockDate
            }"
            @click="createReserve"
            :disabled="!amountToDeposit || !unclockDate"
          >
            CREATE RESERVE
          </b-button>
          <b-button class="btn-cancel" @click="hideModal()">
            Cancel
          </b-button>
        </b-form>
        <div v-if="isShow == 'calendar'">
          <FunctionalCalendar
            :is-dark="true"
            :is-date-picker="true"
            :date-format="'dd/mm/yyyy'"
            :disabledDates="['beforeToday',dateNow]"
            v-on:choseDay="clickDay"
          ></FunctionalCalendar>
          <b-button class="btn-cancel" @click="backForm()">
            Back
          </b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      hide-footer
      hide-header
      centered
      ref="modal-claim"
      title="Using Component Methods"
      id="modal-add"
    >
      <div class="head-modal">
        <b-img src="/img/dai.svg"></b-img>
        <span class="title-popup">
          CLAIM {{ selectedAsset ? selectedAsset.name : '' }} RESERVE
        </span>
      </div>
      <div class="content-modal content-modal-claim">
        <b-form>
          <b-form-group
            class="text-label text-left"
            label="TOTAL CLAIMABLE BALANCE"
            label-for="totalClaim"
          >
            <b-form-input
              class="value-available"
              type="text"
              :value="`${ selectedReserve.totalBalance }`"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group
            class="text-label text-left input-rlt"
            label="ENTER AMOUNT TO CLAIM"
            label-for="claimingAmount"
          >
            <b-form-input
              v-model="amountToWithdraw"
              class="enter-money"
              type="text"
              placeholder="0.00"
            >
            </b-form-input>
            <b-button @click="maxClaimableAmount(selectedReserve.totalBalance)" class="btn-position">
              MAX
            </b-button>
          </b-form-group>
          <b-form-group
            class="text-label text-left"
            label="SUMMARY"
            label-for="summary"
          >
            <div class="line-horizontal"></div>
            <div class="wrap-summary">
              <div>
                <label class="">Initial Reserve Deposit:</label>
                <span>{{ selectedReserve.deposited }}</span>
              </div>
              <div>
                <label>Token Earnings:</label>
                <span>{{ selectedReserve.earned }}</span>
              </div>
              <div>
                <label>Total % Gains:</label>
                <span class="percent">{{ selectedReserve.earned * 100 / selectedReserve.totalBalance }}%</span>
              </div>
            </div>
          </b-form-group>
          <b-button class="btn-claim" @click="claimReserve(selectedReserve)">
            CLAIM BALANCE
          </b-button>
          <b-button class="btn-cancel" @click="hideModalClaim()">
            Cancel
          </b-button>
        </b-form>
      </div>
    </b-modal>
    <MiningTransaction></MiningTransaction>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Web3 from "web3";
import { FunctionalCalendar } from "vue-functional-calendar";
import MiningTransaction from "../../components/widgets/MiningTransaction";
import accounting from "accounting";

const currentVersion = require("../../../package.json").version;
const moment = require("moment");

export default {
  name: "dashboard",
  components: {
    FunctionalCalendar,
    MiningTransaction
  },
  data() {
    return {
      dateNow : null,
      version: currentVersion,
      isShow: "form-add",
      isShowClaim: "form-claim",
      txStatus: "",
      txHash: "",
      isConnect: false,
      addressWallet: "",
      walletAssetBalance: 0,
      dayChoose: "",
      amountToDeposit: "",
      amountToWithdraw: "",
      unclockDate: "",
      lockPrice: "",
      selectedAsset: null,
      selectedReserve: "",
      lockPricePosition: "0",
      estPortfolio: 0,
      estEarnings: 0,
      totalChange24h: 0,
      options: [
        { value: "0", text: "Below" },
        { value: "1", text: "Above" }
      ],
      reservesCounter: 0,
      poolsCounter: 0,
      data: [
        {
          name: "DAI",
          fullName: "Maker Dai",
          image: "dai.svg",
          erc20Token: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          estchange24h: 0,
          assetEarning: 0,
          usdEarning: 0,
          providerReserves: []
        },
        {
          name: "USDC",
          fullName: "USD Coin",
          image: "usdc.svg",
          erc20Token: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          estchange24h: 0,
          assetEarning: 0,
          usdEarning: 0,
          providerReserves: []
        },
        {
          name: "ETH",
          fullName: "Ethereum",
          image: "eth.svg",
          erc20Token: "0x0000000000000000000000000000000000000000",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          estchange24h: 0,
          assetEarning: 0,
          usdEarning: 0,
          providerReserves: []
        },
        {
          name: "REP",
          fullName: "Augur",
          image: "mkr.svg",
          erc20Token: "0x6e894660985207feb7cf89Faf048998c71E8EE89",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          estchange24h: 0,
          assetEarning: 0,
          usdEarning: 0,
          providerReserves: []
        },
        {
          name: "wBTC",
          fullName: "Wrapped BTC",
          image: "wbtc.svg",
          erc20Token: "0x577D296678535e4903D59A4C929B718e1D575e0A",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          estchange24h: 0,
          assetEarning: 0,
          usdEarning: 0,
          providerReserves: []
        }
      ],
      chartOptionsLine: {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          show: false,
          timeline: {
            show: false
          }
        },
        xAxis: {
          show: false,
          data: []
        },
        yAxis: {
          min: 1,
          show: false
        },
        series: [
          {
            showSymbol: false,
            type: "line",
            data: [55, 72, 84, 48, 2000, 62, 500, 75, 94, 1011, 127, 118, 100]
          }
        ],
        title: {
          show: false
        },
        color: ["#14DC94"]
      },
      fields: [
       {
          key: "createdAt",
          label: "Created",
          thStyle: { width: "16.66%" }
        },
        {
          key: "deposited",
          label: "Reserve Total",
          thStyle: { width: "16.66%" }
        },
        {
          key: "est_USD_value",
          label: "Est USD Value",
          thStyle: { width: "16.66%" }
        },
        {
          key: "lockingPeriod",
          label: "Unlocking on",
          thStyle: { width: "16.66%" }
        },
           {
          key: "lockingPrice",
          label: "Unlock Price",
          thStyle: { width: "16.66%" }
        },
        {
          key: "earned",
          label: "Total Earnings",
          thStyle: { width: "16.66%" }
        },
        {
          key: "btn",
          label: "",
          thStyle: { width: "16.66%" }
        }
      ],
      items: []
    };
  },
  async created() {
    this.dateNow = moment().format('DD/MM/YYYY');
    this.data.map(item => {
      this.GET_PRICE_COIN({
        name: item.name
      });
    });
    if (window.web3.currentProvider.selectedAddress) {
      var addressWallet = window.web3.currentProvider.selectedAddress;
      this.addressWallet =
        addressWallet.substr(0, 4) +
        "..." +
        addressWallet.substr(addressWallet.length - 4, 4);
      this.isConnect = true;
      window.web3 = new Web3(window.web3.currentProvider);

      await this.INIT_APP(window.web3);

      this.selectWallet(this.data[0]);
      await this.LOAD_PROVIDER_LIQUIDITY_RESERVES();
      //await this.getProviderReserves();
      console.log("provider liquidity reserves");
      console.log(this.providerLiquidityReserves);
      console.log("provider liquidity reserves details");
      console.log(this.providerReservesDetails);
    }
    else{
      this.selectWallet(this.data[0]);
    }
  },
  computed: {
    ...mapState("ContractController", [
      "currentNetwork",
      "account",
      "alkemiNetwork",
      "providerLiquidityReserves",
      "providerReservesDetails",
      "tokenBalance",
      "priceCoin",
      "unitCoin"
    ])
  },
  watch: {
    providerLiquidityReserves: function(value) {
      if (value) {
        this.getProviderReservesDetails();
      }
    }
  },
  filters: {
    formatMoney: value => {
      if (value) {
        accounting.settings = {
          currency: {
            symbol: "$",
            decimal: ".",
            thousand: ",",
            precision: 2,
            format: "%s%v"
          },
          number: {
            precision: 0,
            thousand: ",",
            decimal: "."
          }
        };
        return accounting.formatMoney(value);
      }
      return "0.00";
    },
    formatMoneyHasDola: value => {
      accounting.settings = {
        currency: {
          symbol: "$",
          decimal: ".",
          thousand: ",",
          precision: 2,
          format: "%s%v"
        },
        number: {
          precision: 0,
          thousand: ",",
          decimal: "."
        }
      };
      return accounting.formatMoney(value);
    },
    formatMoneyReturnNull: value => {
      if (value) {
        accounting.settings = {
          currency: {
            symbol: "$",
            decimal: ".",
            thousand: ",",
            precision: 2,
            format: "%s%v"
          },
          number: {
            precision: 0,
            thousand: ",",
            decimal: "."
          }
        };
        return accounting.formatMoney(value);
      }
      return "";
    },
    formatPercent: value => {
      return accounting.formatMoney(value, { symbol: "%", format: "%v%s" });
    },
    formatPercentSpace: value => {
      return accounting.formatMoney(value, { symbol: " %", format: "%v%s" });
    },
    formatNumberReturnZero: value => {
      accounting.settings = {
        currency: {
          symbol: "",
          decimal: ".",
          thousand: ",",
          precision: 2,
          format: "%s%v"
        },
        number: {
          precision: 0,
          thousand: ",",
          decimal: "."
        }
      };
      return accounting.formatMoney(value);
    },
    transformMoney: value => {
      if (value) {
        accounting.settings = {
          currency: {
            symbol: "+",
            decimal: ".",
            thousand: ",",
            precision: 2,
            format: "%s%v"
          },
          number: {
            precision: 0,
            thousand: ",",
            decimal: "."
          }
        };
        return accounting.formatMoney(value);
      }
      return "-";
    },
    formatUSDEarning: value => {
      if (value) {
        accounting.settings = {
          currency: {
            symbol: "+ $",
            decimal: ".",
            thousand: ",",
            precision: 2,
            format: "%s%v"
          },
          number: {
            precision: 0,
            thousand: ",",
            decimal: "."
          }
        };
        return accounting.formatMoney(value);
      }
      return "-";
    },
    formatNumber: value => {
      if (value) {
        return value;
      }
      return "-";
    },
    formatDate: value => {
      let datFormat = moment(value, "MM-DD-YYYY").format("DD MMM YY");
      if (datFormat) {
        return datFormat;
      }
      return "-";
    }
  },
  methods: {
    ...mapActions("ContractController", [
      "INIT_APP",
      "LOAD_PROVIDER_LIQUIDITY_RESERVES",
      "CREATE_LIQUIDITY_RESERVE",
      "LOAD_TOKEN_LIQUIDITY_RESERVES",
      "GET_RESERVE_DETAILS",
      "GET_TOKEN_BALANCE",
      "GET_PRICE_COIN",
      "CLAIM_LIQUIDITY_RESERVE"
    ]),
     ...mapMutations("ContractController", [
      "SET_EMPTY_PROVIDER_RESERVE_DETAILS",
      "SET_PROVIDER_LIQUIDITY_RESERVE"
    ]),
    async connectWallet() {
       this.selectWallet(this.data[0]);
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
         
          window.ethereum.enable().then(addressWallet => {
            this.INIT_APP(window.web3)
            .then(result=>{
              console.log(result)
              this.LOAD_PROVIDER_LIQUIDITY_RESERVES();  
            })
            this.addressWallet =
              addressWallet[0].substr(0, 4) +
              "..." +
              addressWallet[0].substr(addressWallet[0].length - 4, 4);
            console.log(this.addressWallet);
            this.isConnect = true;
            window.web3.eth
              .getBalance(window.web3.currentProvider.selectedAddress)
              .then(coins => {
                this.walletAssetBalance = coins;
              });
          });
        } catch (error) {
          console.log(error);
          window.web3 = new Web3(
            new Web3.providers.HttpProvider(
              "https://rinkeby.infura.io/v3/816cc7a6308448dbbaf46ac5488507cf"
            )
          );
          this.INIT_APP(window.web3);
          
        }
      } else if (window.web3) {
        console.log("Running legacy web3 provider");
        //window.web3 = new Web3(web3.currentProvider);
        //this.INIT_APP(window.web3);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    },
    createReserve() {
      let depositAmount = 0;
      if(this.selectedAsset.erc20Token == this.data[1].erc20Token) {
        depositAmount = (
          window.web3.utils.toWei(this.amountToDeposit.toString(), "ether") / 10**12).toString();
      }
      else {
        depositAmount = window.web3.utils.toWei(
          this.amountToDeposit.toString(),
          "ether"
        );
      }

      this.CREATE_LIQUIDITY_RESERVE({
        web3: window.web3,
        linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        beneficiary: "0x0000000000000000000000000000000000000000",
        erc20Token: this.selectedAsset.erc20Token,
        createdAt: moment().unix().toString(),
        lockingPeriod: moment(this.dayChoose, "DD-MM-YYYY")
          .unix()
          .toString(),
        lockingPrice: window.web3.utils.toWei(
          this.lockPrice.toString(),
          "ether"
        ),
        lockingPricePosition: parseFloat(this.lockPricePosition),
        depositAmount: depositAmount
      });
      
      this.hideModal();
    },
    claimReserve(reserve) {
      console.log("reserve to claim");
      console.log(reserve);

      this.CLAIM_LIQUIDITY_RESERVE({
        web3: window.web3,
        reserveAddress: reserve.address,
        amount: window.web3.utils.toWei(this.amountToWithdraw, "ether"),
        oracle: "0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e",
        jobId: window.web3.utils.fromAscii("0e9e244b9c374cd1a5c714caf25b0be5"),
        tokenSymbol: reserve.assetSymbol,
        market: "USD",
        oraclePayment: window.web3.utils.toWei("1", "ether"),
      });

      this.hideModalClaim();
    },
    async getProviderReservesDetails() {
      this.reservesCounter = this.providerLiquidityReserves.length;

      this.data[0].total = 0;
      this.data[0].assetEarning = 0;
      this.data[1].total = 0;
      this.data[1].assetEarning = 0;
      this.data[2].total = 0;
      this.data[2].assetEarning = 0;
      this.data[3].total = 0;
      this.data[3].assetEarning = 0;
      this.data[4].total = 0;
      this.data[4].assetEarning = 0;
      this.estPortfolio = 0;
      this.estEarnings = 0;
      await this.SET_EMPTY_PROVIDER_RESERVE_DETAILS();

      for (let i = 0; i < this.providerLiquidityReserves.length; i++) {
        await this.GET_RESERVE_DETAILS({
          web3: window.web3,
          reserveAddress: this.providerLiquidityReserves[i]
        });
      }

      let providerReservesDai = [];
      let providerReservesUSDC = [];
      let providerReservesETH = [];
      let providerReservesRep = [];
      let providerReservesWbtc = [];

      this.providerReservesDetails.map((reserve, key) => {
        console.log(reserve.asset);
        switch (reserve.asset.toLowerCase()) {
          case "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa".toLowerCase():
            reserve.address = this.providerLiquidityReserves[key];
            reserve.assetSymbol = "DAI";
            this.data[0].total += parseFloat(reserve.totalBalance);
            this.data[0].assetEarning += parseFloat(reserve.earned);
            providerReservesDai.push(reserve);
            this.estPortfolio =
              this.estPortfolio +
              (parseFloat(reserve.deposited) *
              this.priceCoin[`${this.data[0].name}/${this.unitCoin}`]);
            this.estEarnings =
              this.estEarnings +
              parseFloat(reserve.earned) *
              this.priceCoin[`${this.data[0].name}/${this.unitCoin}`];
            if (this.priceCoin[`${this.data[0].name}/${this.unitCoin}`]) {
              this.data[0].estUSD =
                this.data[0].total *
                this.priceCoin[`${this.data[0].name}/${this.unitCoin}`];
              this.data[0].estFluctuation =
                this.data[0].fluctuation *
                this.priceCoin[`${this.data[0].name}/${this.unitCoin}`];
            } else {
              this.GET_PRICE_COIN({
                name: this.data[0].name
              }).then(res => {
                this.data[0].estUSD = this.data[0].total * res.data.last;
                this.data[0].estFluctuation =
                  this.data[0].fluctuation * res.data.last;
              });
            }
            break;
          case "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b".toLowerCase():
            reserve.address = this.providerLiquidityReserves[key];
            reserve.assetSymbol = "USDC";
            this.data[1].total += parseFloat(reserve.totalBalance);
            this.data[1].assetEarning += parseFloat(reserve.earned);
            providerReservesUSDC.push(reserve);
            this.estPortfolio =
              this.estPortfolio +
              (parseFloat(reserve.deposited) *
              this.priceCoin[`${this.data[1].name}/${this.unitCoin}`]);
              console.log(this.estPortfolio, '2222', (parseFloat(reserve.deposited) *
              this.priceCoin[`${this.data[1].name}/${this.unitCoin}`]));
            this.estEarnings =
              this.estEarnings +
              parseFloat(reserve.earned) *
              this.priceCoin[`${this.data[1].name}/${this.unitCoin}`];
            if (this.priceCoin[`${this.data[1].name}/${this.unitCoin}`]) {
              this.data[1].estUSD =
                this.data[1].total *
                this.priceCoin[`${this.data[1].name}/${this.unitCoin}`];
              this.data[1].estFluctuation =
                this.data[1].fluctuation *
                this.priceCoin[`${this.data[1].name}/${this.unitCoin}`];
            } else {
              this.GET_PRICE_COIN({
                name: this.data[1].name
              }).then(res => {
                this.data[1].estUSD = this.data[1].total * res.data.last;
                this.data[1].estFluctuation =
                  this.data[1].fluctuation * res.data.last;
              });
            }
            break;
          case "0x0000000000000000000000000000000000000000".toLowerCase():
            reserve.address = this.providerLiquidityReserves[key];
            reserve.assetSymbol = "ETH";
            this.data[2].total += parseFloat(reserve.totalBalance);
            this.data[2].assetEarning += parseFloat(reserve.earned);
            providerReservesETH.push(reserve);
            // this.estPortfolio =
            //   this.estPortfolio +
            //   parseFloat(reserve.deposited) *
            //   this.priceCoin[`${this.data[2].name}/${this.unitCoin}`];
            // this.estEarnings =
            //   this.estEarnings +
            //   (parseFloat(reserve.earned) *
            //   this.priceCoin[`${this.data[2].name}/${this.unitCoin}`]);
            if (this.priceCoin[`${this.data[2].name}/${this.unitCoin}`]) {
              this.data[2].estUSD =
                this.data[2].total *
                this.priceCoin[`${this.data[2].name}/${this.unitCoin}`];
              this.data[2].estFluctuation =
                this.data[2].fluctuation *
                this.priceCoin[`${this.data[2].name}/${this.unitCoin}`];
            } else {
              this.GET_PRICE_COIN({
                name: this.data[2].name
              }).then(res => {
                this.data[2].estUSD = this.data[2].total * res.data.last;
                this.data[2].estFluctuation =
                  this.data[2].fluctuation * res.data.last;
              });
            }
            break;
          case "0x6e894660985207feb7cf89Faf048998c71E8EE89".toLowerCase():
            reserve.address = this.providerLiquidityReserves[key];
            reserve.assetSymbol = "0x4d4b520000000000000000000000000000000000000000000000000000000000";
            this.data[3].total += parseFloat(reserve.totalBalance);
            this.data[3].assetEarning += parseFloat(reserve.earned);
            providerReservesRep.push(reserve);
            // this.estPortfolio =
            //   this.estPortfolio +
            //   parseFloat(reserve.deposited) *
            //   this.priceCoin[`${this.data[3].name}/${this.unitCoin}`];
            // this.estEarnings =
            //   this.estEarnings +
            //   (parseFloat(reserve.earned) *
            //   this.priceCoin[`${this.data[3].name}/${this.unitCoin}`]);
            if (this.priceCoin[`${this.data[3].name}/${this.unitCoin}`]) {
              this.data[3].estUSD =
                this.data[3].total *
                this.priceCoin[`${this.data[3].name}/${this.unitCoin}`];
              this.data[3].estFluctuation =
                this.data[3].fluctuation *
                this.priceCoin[`${this.data[3].name}/${this.unitCoin}`];
            } else {
              this.GET_PRICE_COIN({
                name: this.data[3].name
              }).then(res => {
                this.data[3].estUSD = this.data[3].total * res.data.last;
                this.data[3].estFluctuation =
                  this.data[3].fluctuation * res.data.last;
              });
            }
            break;
          case "0x577D296678535e4903D59A4C929B718e1D575e0A".toLowerCase():
           reserve.assetSymbol = "WBTC";
            reserve.address = this.providerLiquidityReserves[key];
            this.data[4].total += parseFloat(reserve.totalBalance);
            this.data[4].assetEarning += parseFloat(reserve.earned);
            providerReservesWbtc.push(reserve);
            // this.estPortfolio =
            //   this.estPortfolio +
            //   parseInt(reserve.deposited) *
            //   this.priceCoin[`${this.data[3].name}/${this.unitCoin}`];
            // this.estEarnings =
            //   this.estEarnings +
            //   (parseInt(reserve.earned) *
            //   this.priceCoin[`${this.data[3].name}/${this.unitCoin}`]);
            if (this.priceCoin[`${this.data[4].name}/${this.unitCoin}`]) {
              this.data[4].estUSD =
                this.data[4].total *
                this.priceCoin[`${this.data[4].name}/${this.unitCoin}`];
              this.data[4].estFluctuation =
                this.data[4].fluctuation *
                this.priceCoin[`${this.data[4].name}/${this.unitCoin}`];
            } else {
              this.GET_PRICE_COIN({
                name: this.data[4].name
              }).then(res => {
                this.data[4].estUSD = this.data[4].total * res.data.last;
                this.data[4].estFluctuation =
                  this.data[4].fluctuation * res.data.last;
              });
            }
            break;
          default:
            break;
        }

        console.log("usdc reserves");
        console.log(this.data[1].providerReserves);

        this.data[0].providerReserves = providerReservesDai;
        this.data[1].providerReserves = providerReservesUSDC;
        this.data[2].providerReserves = providerReservesETH;
        this.data[3].providerReserves = providerReservesRep;
        this.data[4].providerReserves = providerReservesWbtc;

        // pools counter
        if(providerReservesDai.length > 0) {
          this.poolsCounter++;
        }
        if(providerReservesUSDC.length > 0) {
          this.poolsCounter++;
        }
        if(providerReservesETH.length > 0) {
          this.poolsCounter++;
        }
        if(providerReservesRep.length > 0) {
          this.poolsCounter++;
        }
        if(providerReservesWbtc.length > 0) {
          this.poolsCounter++;
        }
      });
    },
    /* eslint-enable */
    showModal() {
      this.$refs["modal-add-new"].show();
    },
    hideModal() {
      this.$refs["modal-add-new"].hide();
      this.amountToDeposit = 0;
    },
    showModalClaim(selectedReserve) {
      this.selectedReserve = selectedReserve;
      this.$refs["modal-claim"].show();
    },
    hideModalClaim() {
      this.selectedReserve = "";
      this.$refs["modal-claim"].hide();
    },
    showCalendar() {
      this.isShow = "calendar";
    },
    backForm() {
      this.isShow = "form-add";
    },
    clickDay(data) {
      if (moment(data.date, "DD-MM-YYYY") > moment()) {
        this.unclockDate = moment(data.date, "DD-MM-YYYY").format(
          "DD MMM YYYY"
        );
        this.dayChoose = data.date;
        this.isShow = "form-add";
      }
      return false;
    },
    timestampToDate(timestamp) {
      return moment.unix(timestamp).format("MM/DD/YYYY");
    },
    maxAvailable() {
      this.amountToDeposit = this.tokenBalance;
    },
    maxClaimableAmount(maxAmount) {
      this.amountToWithdraw = maxAmount;
    },
    async selectWallet(item)  {
       this.selectedAsset = item;
      if(window.web3.currentProvider.selectedAddress){
        await this.GET_TOKEN_BALANCE({
          web3: window.web3, 
          erc20: item.erc20Token
        });
      }
    },
    getTimeLocal(){
      let formatDate = moment().format("DD-MM-YYYY");
      return moment(formatDate, "DD-MM-YYYY").unix().toString();
    },
    diffDay(day){
      if (day) {
        let dayUnclock = moment.unix(day).format('DD-MM-YYYY HH:mm');
        let before = moment(dayUnclock,'DD-MM-YYYY HH:mm');
        return moment(before - moment()).format('D[ Days ] H[ Hrs]');
      }
    },
  }
};
</script>
