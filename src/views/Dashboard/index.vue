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
                    <div class="monney">$1,354,884.45</div>
                  </div>
                  <div class="est-content">
                    <div class="title-es-content">EST USD EARNINGS 24 hr:</div>
                    <div class="monney mb-20">$7,729.09</div>
                    <div class="title-es-content">CHANGE 24hr:</div>
                    <div class="change-number">+12.22%</div>
                  </div>
                  <div class="est-content">
                    <div class="float-left mr-30">
                      <div class="title-es-content">RESERVES</div>
                      <div class="monney">3</div>
                    </div>
                    <div>
                      <div class="title-es-content">POOLS</div>
                      <div class="monney">12</div>
                    </div>
                  </div>
                </b-col>
                <b-col md="10">
                  <div>
                    <b-card no-body>
                      <b-tabs pills card vertical>
                        <b-tab
                        @click="selectWallet(item, key)"
                         v-for="(item, key) in data" :key="key">
                          <template v-slot:title>
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img :src="'/img/'+item.image"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                {{ item.name }}
                                <div class="name-el-money">{{ item.fullName }}</div>
                              </div>
                              <div class="content-mid">
                                {{ total[item.name] | formatNumber }}
                                <div class="cost">$9344.44</div>
                              </div>
                              <div class="content-mid">
                                +1443.22 <span class="percent">(6.54%)</span>
                                <div class="cost">$334.54</div>
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">{{ total[item.name] | formatNumber }}</div>
                                  <span class="acronym-name">
                                    {{ item.name }}
                                    <span class="line-vertical-14">|</span>
                                    <span class="el-name">
                                      {{ item.fullName }}
                                    </span>
                                  </span>
                                  <span
                                    class="address-in-content float-right"
                                    >{{ addressWallet }}</span
                                  >
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    $9344.44
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
                                      <div class="percent">+5.55 %</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        +29,322.34
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        + $12,333.12
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
                                  <div class="float-left">RESERVE POOLS</div>
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
                                    :items="items"
                                    :fields="fields"
                                  >
                                    <template v-slot:cell(btn)="row">
                                      <b-button
                                        v-if="!row.item.btn"
                                        size="sm"
                                        class="btn-claim float-right"
                                        @click="showModalClaim"
                                      >
                                        CLAIM
                                      </b-button>
                                      <b-button
                                        v-if="row.item.btn"
                                        size="sm"
                                        class="btn-claim-value float-right"
                                      >
                                        {{ row.item.btn }}
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
          ADD {{ selected.name }} POOL
        </span>
      </div>
      <div class="content-modal">
        <b-form v-if="isShow == 'form-add'">
          <b-form-group
            class="text-label text-left"
            label="AVAILABLE DAI BALANCE"
            label-for="daiBlance"
          >
            <b-form-input
              class="value-available"
              type="text"
              v-model="daiBlance"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group
            class="text-label text-left input-rlt"
            label="ENTER FUNDING AMOUNT"
            label-for="fundingAmount"
          >
            <b-form-input
              v-model="enterMoney"
              class="enter-money"
              type="text"
              placeholder="0.00"
            >
            </b-form-input>
            <b-button
              @click="maxAvailable"
              class="btn-position"
            >
              MAX
            </b-button>
          </b-form-group>
          <b-form-group
            class="text-label text-left"
            label="SELECT UNLOCK DATE"
            label-for="unclockDate"
          >
            <div
              class="choose-date"
              @click="showCalendar"
            >
              <input
                type="text"
                v-model="unclockDate"
                disabled
              />
              <b-img
                src="/img/arrow-down-sign-to-navigate.png"
              ></b-img>
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
              'btn-modal-add-new':
                enterMoney && unclockDate,
              'btn-modal-disable':
                !enterMoney || !unclockDate
            }"
            @click="createReserve"
            :disabled="
              !enterMoney || !unclockDate
            "
          >
            CREATE POOL
          </b-button>
          <b-button
            class="btn-cancel"
            @click="hideModal()"
          >
            Cancel
          </b-button>
        </b-form>
        <div v-if="isShow == 'calendar'">
          <FunctionalCalendar
            :is-dark="true"
            :is-date-picker="true"
            :date-format="'dd/mm/yyyy'"
            v-on:choseDay="clickDay"
          ></FunctionalCalendar>
          <b-button
            class="btn-cancel"
            @click="backForm()"
          >
            Back
          </b-button>
        </div>
        <div
          v-if="isShow == 'loading'"
          class="processing"
        >
          <div>
            <div class="title-process">
              Processing Transaction
            </div>
            <div class="address-transaction">
              0xbj39....1ea401
            </div>
            <loadingPopup
              :quality="4"
            ></loadingPopup>
          </div>
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
          CLAIM ADD DAI POOL
        </span>
      </div>
      <div class="content-modal content-modal-claim">
        <b-form>
          <b-form-group
            class="text-label text-left"
            label="TOTAL CLAIMABLE OMG BALANCE"
            label-for="totalClaim"
          >
            <b-form-input
              class="value-available"
              type="text"
              value="10,332.78"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group
            class="text-label text-left"
            label="SELECT WALLET"
            label-for="selectWallet"
          >
            <div class="select-relative">
              <b-form-select class="select-wallet"></b-form-select>
              <b-img src="/img/arrow-down-sign-to-navigate.png"></b-img>
            </div>
          </b-form-group>
          <b-form-group
            class="text-label text-left"
            label="SUMMARY"
            label-for="summary"
          >
            <div class="line-horizontal"></div>
            <div class="wrap-summary">
              <div>
                <label class="">Initial Pool Size:</label>
                <span>101,600.20</span>
              </div>
              <div>
                <label>Token Earnings:</label>
                <span>16.232.12</span>
              </div>
              <div>
                <label>Total % Gains:</label>
                <span class="percent">21:59%</span>
              </div>
            </div>
          </b-form-group>
          <b-button class="btn-claim" @click="loading">
            CLAIM BALANCE
          </b-button>
          <b-button class="btn-cancel" @click="hideModalClaim()">
            Cancel
          </b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Web3 from "web3";
import { FunctionalCalendar } from "vue-functional-calendar";
import loadingPopup from "../../components/loading-popup/index";
import accounting from "accounting";

const currentVersion = require("../../../package.json").version;
const moment = require("moment");

export default {
  name: "dashboard",
  components: {
    FunctionalCalendar,
    loadingPopup
  },
  data() {
    return {
      version: currentVersion,
      isShow: "form-add",
      isConnect: false,
      addressWallet: "",
      daiBlance: 0,
      dayChoose: "",
      enterMoney: "",
      unclockDate: "",
      lockPrice: "",
      selected: null,
      lockPricePosition: "0",
      options: [
        { value: "0", text: 'Below' },
        { value: "1", text: 'Above' },
      ],
      total: {
        DAI: 0,
        USDC: 0,
        LINK: 0,
        MKR: 0,
        KRWB: 0
      },
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
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        },
        {
          name: "USDC",
          fullName: "USD Coin",
          image: "usdc.svg",
          erc20Token: "0x9be1001d601102ae0f24ab4764dd5ce2f3e5b096",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        },
        {
          name: "LINK",
          fullName: "LinkCoin",
          image: "link.svg",
          erc20Token: "0xf6b1c64e86c1213088a6464484ebb8488635795d",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        },
        {
          name: "MKR",
          fullName: "Maker",
          image: "mkr.svg",
          erc20Token: "0xb763e26cd6dd09d16f52dc3c60ebb77e46b03290",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        },
        {
          name: "KRWB",
          fullName: "Korean Won",
          image: "krwb.svg",
          erc20Token: "0x7fca0bf31dcec373c90478c9167b8b11b7dec3a1",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        },
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
          key: "created",
          label: "Created",
          thStyle: { width: "16.66%" }
        },
        {
          key: "total_size",
          label: "Total Size",
          thStyle: { width: "16.66%" }
        },
        {
          key: "est_USD_value",
          label: "Est USD Value",
          thStyle: { width: "16.66%" }
        },
        {
          key: "total_earnings",
          label: "Total Earnings",
          thStyle: { width: "16.66%" }
        },
        {
          key: "total_percent_earnings",
          label: "Total % Earnings",
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
    if (window.web3.currentProvider.selectedAddress) {
      var addressWallet = window.web3.currentProvider.selectedAddress;
      this.addressWallet =
        addressWallet.substr(0, 4) +
        "..." +
        addressWallet.substr(addressWallet.length - 4, 4);
      this.isConnect = true;
      window.web3 = new Web3(window.web3.currentProvider);
      this.selected = this.data[0],
      await this.INIT_APP(window.web3);
      await this.LOAD_PROVIDER_LIQUIDITY_RESERVES();
      console.log("provider liquidity reserves");
      console.log(this.providerLiquidityReserves);
      await this.getProviderReservesDetails();
      console.log("provider liquidity reserves details");
      console.log(providerReservesDetails);
    }
  },
  computed: {
    ...mapState("ContractController", [
      "currentNetwork",
      "account",
      "alkemiNetwork",
      "providerLiquidityReserves",
      "providerReservesDetails",
      "tokensBalance"
    ])
  },
  watch: {
    alkemiNetwork: function(value) {
      if (value) this.LOAD_PROVIDER_LIQUIDITY_RESERVES();
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
    }
  },
  methods: {
    ...mapActions("ContractController", [
      "INIT_APP",
      "LOAD_PROVIDER_LIQUIDITY_RESERVES",
      "CREATE_LIQUIDITY_RESERVE",
      "LOAD_TOKEN_LIQUIDITY_RESERVES",
      "GET_RESERVE_DETAILS",
      "GET_TOKEN_BALANCE"
    ]),
    connectWallet() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          window.ethereum.enable().then(addressWallet => {
            this.INIT_APP(window.web3);
            this.addressWallet =
              addressWallet[0].substr(0, 4) +
              "..." +
              addressWallet[0].substr(addressWallet[0].length - 4, 4);
            console.log(this.addressWallet);
            this.isConnect = true;
            window.web3.eth
              .getBalance(window.web3.currentProvider.selectedAddress)
              .then(coins => {
                this.daiBlance = coins;
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
      this.CREATE_LIQUIDITY_RESERVE({
        web3: window.web3,
        linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        beneficiary: "0x0000000000000000000000000000000000000000",
        erc20Token: this.selected.erc20Token,
        lockingPeriod: moment(this.dayChoose, "DD-MM-YYYY")
          .unix()
          .toString(),
        lockingPrice: window.web3.utils.toWei(
          this.lockPrice.toString(),
          "ether"
        ),
        lockingPricePosition: parseInt(this.lockPricePosition),
        depositAmount: window.web3.utils.toWei(
          this.enterMoney.toString(),
          "ether"
        )
      });
    },
    async getProviderReservesDetails() {
      for(let i=0; i<this.providerLiquidityReserves.length; i++) {
        this.GET_RESERVE_DETAILS({
          web3: window.web3,
          reserveAddress: this.providerLiquidityReserves[i]
        }).then( result => {
          result = this.providerReservesDetails;
          result.forEach(element => {
            switch (element.asset) {
              case "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa":
                this.total.DAI += element.deposited.words.reduce((a, b) => a + b)
                break;
              case "0x9be1001d601102ae0f24ab4764dd5ce2f3e5b096":
                this.total.USDC += element.deposited.words.reduce((a, b) => a + b)
                break;
              case "0xf6b1c64e86c1213088a6464484ebb8488635795d":
                this.total.LINK += element.deposited.words.reduce((a, b) => a + b)
                break;
              case "0xb763e26cd6dd09d16f52dc3c60ebb77e46b03290":
                this.total.MKR += element.deposited.words.reduce((a, b) => a + b)
                break;
              default:
                this.total.KRWB += element.deposited.words.reduce((a, b) => a + b)
                break;
            }
          });
        });
      }
    },
    /* eslint-enable */
    showModal() {
      this.$refs["modal-add-new"].show();
    },
    hideModal() {
      this.$refs["modal-add-new"].hide();
    },
    showModalClaim() {
      this.$refs["modal-claim"].show();
    },
    hideModalClaim() {
      this.$refs["modal-claim"].hide();
    },
    showCalendar() {
      this.isShow = "calendar";
    },
    backForm() {
      this.isShow = "form-add";
    },
    clickDay(data) {
      if (data.date) {
        this.unclockDate = moment(data.date, "DD/MM/YYYY").format(
          "DD MMM YYYY"
        );
        this.dayChoose = data.date;
        this.isShow = "form-add";
      }
      return false;
    },
    maxAvailable() {
      this.enterMoney = this.daiBlance;
    },
    loading() {
      this.isShow = "loading";
      setTimeout(() => {
        this.isShow = "form-add";
        return this.hideModal();
      }, 4000);
      // clearTimeout(timerid);
    },
    selectWallet(item)  {
      this.selected = item
    }
  }
};
</script>
