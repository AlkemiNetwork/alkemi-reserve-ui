<template>
  <div>
    <b-row>
      <b-col lg="12">
        <b-row class="head d-flex align-items-center">
          <b-col md="6">
            <div class="float-left pl-35">
              <img
                src="img/alkemi-logo-horizontal-all-white.svg"
                alt="Alkemi"
              />
              <span class="vertical-line"> | </span>
              <span class="cl-text-banner">Liquidity Reserve Dashboard</span>
            </div>
          </b-col>
          <b-col md="6">
            <div class="float-right pr-35">
              <b-button-group v-if="!isConnect">
                <b-button @click="connectWallet" variant="akm"
                  >Connect</b-button
                >
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
              <b-col md="2">
                <div class="est-content">
                  <div class="title-es-content">EST PORTFOLIO USD VALUE:</div>
                  <div class="monney mb-20">$1,354,884.45</div>
                </div>
                <div class="est-content">
                  <div class="title-es-content">EST USD EARNINGS 24 hr:</div>
                  <div class="monney mb-20">$7,729.09</div>
                </div>
                <div class="est-content">
                  <div class="title-es-content">CHANGE 24hr:</div>
                  <div class="change-number mb-20">+12.22%</div>
                </div>
                <div class="est-content">
                  <div class="float-left mr-30">
                    <div class="title-es-content">RESERVES</div>
                    <div class="monney mb-20">3</div>
                  </div>
                  <div>
                    <div class="title-es-content">POOLS</div>
                    <div class="monney mb-20">12</div>
                  </div>
                </div>
              </b-col>
              <b-col md="10">
                <div>
                  <b-card no-body>
                    <b-tabs pills card vertical>
                      <b-tab>
                        <template v-slot:title>
                          <div class="content-mid-img">
                            <b-img src="/img/omg.svg"></b-img>
                          </div>
                          <div class="acronym-name content-mid">
                            OMG
                            <div class="name-el-money">Omise GO</div>
                          </div>
                          <div class="content-mid">
                            120,000.34
                            <div class="cost">$9344.44</div>
                          </div>
                          <div class="content-mid">
                            +1443.22<span class="percent">(6.54%)</span>
                            <div class="cost">$334.54</div>
                          </div>
                        </template>
                        <b-card-text>
                          <template>
                            <div>
                              <div class="info-value">
                                <div class="value float-left">120,000.34</div>
                                <span class="acronym-name"
                                  >OMG |
                                  <span class="el-name">Omise GO</span></span
                                >
                                <div class="clearfix"></div>
                                <div class="est-value">
                                  $9344.44 |
                                  <span class="text-est">EST USD VALUE</span>
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
                                <chart :options="chartOptionsLine"></chart>
                              </div>
                              <div class="form-reserve">
                                <div class="float-left">RESERVE POOLS</div>
                                <div class="float-right">
                                  <b-button variant="add-new" @click="showModal"
                                    >+ Add New</b-button
                                  >
                                </div>
                                <b-modal
                                  hide-header
                                  ref="my-modal"
                                  hide-footer
                                  title="Using Component Methods"
                                  id="modal-add"
                                >
                                  <div class="head-modal">
                                    <b-img src="/img/dai.svg"></b-img>
                                    <span>ADD DAI POOL</span>
                                  </div>
                                  <div class="content-modal">
                                    <b-form>
                                      <b-form-group
                                        class="text-label text-left"
                                        label="AVAILABLE DAI BALANCE"
                                        label-for="input-1"
                                      >
                                        <b-form-input
                                          class="value-available"
                                          type="number"
                                          readonly
                                        ></b-form-input>
                                      </b-form-group>
                                      <b-form-group
                                        class="text-label text-left input-rlt"
                                        label="ENTER FUNDING AMOUNT"
                                        label-for="input-1"
                                      >
                                        <b-form-input
                                          class="enter-money"
                                          type="text"
                                        >
                                        </b-form-input>
                                        <b-button class="btn-position">
                                          MAX
                                        </b-button>
                                      </b-form-group>
                                      <b-form-group
                                        class="text-label text-left"
                                        label="SELECT UNLOCK DATE"
                                        label-for="input-3"
                                      >
                                        <div class="choose-date">
                                          <b-img
                                            src="/img/arrow-down-sign-to-navigate.png"
                                          ></b-img>
                                        </div>
                                      </b-form-group>
                                      <b-button
                                        class="btn-submit btn-modal-add-new"
                                        type="submit"
                                        >CREATE POOL</b-button
                                      >
                                      <b-button
                                        class="btn-cancel"
                                        @click="hideModal()"
                                        >Cancel</b-button
                                      >
                                    </b-form>
                                    <!-- <FunctionalCalendar></FunctionalCalendar> -->
                                  </div>
                                </b-modal>
                                <b-table :items="items" :fields="fields">
                                  <template v-slot:cell(btn)="row">
                                    <b-button
                                      v-if="!row.item.btn"
                                      size="sm"
                                      class="btn-claim"
                                    >
                                      CLAIM
                                    </b-button>
                                    <b-button
                                      v-if="row.item.btn"
                                      size="sm"
                                      class="btn-claim-value"
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
                      <b-tab>
                        <template v-slot:title>
                          <div class="content-mid-img">
                            <b-img src="/img/dai.svg"></b-img>
                          </div>
                          <div class="acronym-name content-mid">
                            DAI
                            <div class="name-el-money">Maker Dai</div>
                          </div>
                          <div class="content-mid">
                            2,344,333.76
                            <div class="cost">$89,344.44</div>
                          </div>
                          <div class="content-mid">
                            +22384.44 <span class="percent">(6.54%)</span>
                            <div class="cost">$334.54</div>
                          </div>
                        </template>
                        <b-card-text>
                          <template>
                            <div>
                              <div class="info-value">
                                <div class="value float-left">120,000.34</div>
                                <span class="acronym-name"
                                  >OMG |
                                  <span class="el-name">Omise GO</span></span
                                >
                                <div class="clearfix"></div>
                                <div class="est-value">
                                  $9344.44 |
                                  <span class="text-est">EST USD VALUE</span>
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
                                <chart :options="chartOptionsLine"></chart>
                              </div>
                            </div>
                          </template>
                        </b-card-text>
                      </b-tab>
                      <b-tab>
                        <template v-slot:title>
                          <div class="content-mid-img">
                            <b-img src="/img/eos.svg"></b-img>
                          </div>
                          <div class="acronym-name content-mid">
                            EOS
                            <div class="name-el-money">EOS</div>
                          </div>
                          <div class="content-mid">
                            182,382.28
                            <div class="cost">$283,382.00</div>
                          </div>
                          <div class="content-mid">
                            +12443.23 <span class="percent">(8.56%)</span>
                            <div class="cost">$12,754.53</div>
                          </div>
                        </template>
                        <b-card-text>
                          <template>
                            <div>
                              <div class="info-value">
                                <div class="value float-left">120,000.34</div>
                                <span class="acronym-name"
                                  >OMG |
                                  <span class="el-name">Omise GO</span></span
                                >
                                <div class="clearfix"></div>
                                <div class="est-value">
                                  $9344.44 |
                                  <span class="text-est">EST USD VALUE</span>
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
                                <chart :options="chartOptionsLine"></chart>
                              </div>
                            </div>
                          </template>
                        </b-card-text>
                      </b-tab>
                      <b-tab>
                        <template v-slot:title>
                          <div class="content-mid-img">
                            <b-img src="/img/mkr.svg"></b-img>
                          </div>
                          <div class="acronym-name content-mid">
                            MKR
                            <div class="name-el-money">Maker</div>
                          </div>
                          <div class="content-mid">
                            65,844.57
                            <div class="cost">$23,003.90</div>
                          </div>
                          <div class="content-mid">
                            +1443.22 <span class="percent">(3.23%)</span>
                            <div class="cost">$334.54</div>
                          </div>
                        </template>
                        <b-card-text>
                          <template>
                            <div>
                              <div class="info-value">
                                <div class="value float-left">120,000.34</div>
                                <span class="acronym-name"
                                  >OMG |
                                  <span class="el-name">Omise GO</span></span
                                >
                                <div class="clearfix"></div>
                                <div class="est-value">
                                  $9344.44 |
                                  <span class="text-est">EST USD VALUE</span>
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
                                <chart :options="chartOptionsLine"></chart>
                              </div>
                            </div>
                          </template>
                        </b-card-text>
                      </b-tab>
                      <b-tab>
                        <template v-slot:title>
                          <div class="content-mid-img">
                            <b-img src="/img/bnb.svg"></b-img>
                          </div>
                          <div class="acronym-name content-mid">
                            BNB
                            <div class="name-el-money">BInance</div>
                          </div>
                          <div class="content-mid">
                            -
                            <div class="cost"></div>
                          </div>
                          <div class="content-mid">
                            - <span class="percent"></span>
                            <div class="cost"></div>
                          </div>
                        </template>
                        <b-card-text>
                          <template>
                            <div>
                              <div class="info-value">
                                <div class="value float-left">120,000.34</div>
                                <span class="acronym-name"
                                  >OMG |
                                  <span class="el-name">Omise GO</span></span
                                >
                                <div class="clearfix"></div>
                                <div class="est-value">
                                  $9344.44 |
                                  <span class="text-est">EST USD VALUE</span>
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
                                <chart :options="chartOptionsLine"></chart>
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
  </div>
</template>

<script>
//const moment = require("moment");
import Web3 from "web3";
import // Not Currently Used
//  FunctionalCalendar
"vue-functional-calendar";
export default {
  name: "dashboard",
  components: {
    //  Registered But not used
    //  FunctionalCalendar
  },
  data() {
    return {
      isConnect: false,
      addressWallet: "",
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
          label: "Created"
        },
        {
          key: "total_size",
          label: "Total Size"
        },
        {
          key: "est_USD_value",
          label: "Est USD Value"
        },
        {
          key: "total_earnings",
          label: "Total Earnings"
        },
        {
          key: "total_percent_earnings",
          label: "Total % Earnings"
        },
        {
          key: "btn",
          label: ""
        }
      ],
      items: [
        {
          created: 40,
          total_size: "Dickerson",
          est_USD_value: "Macdonald",
          total_earnings: "2222",
          total_percent_earnings: "222",
          btn: "15 Days 2 Hrs"
        },
        {
          created: 40,
          total_size: "Dickerson",
          est_USD_value: "Macdonald",
          total_earnings: "2222",
          total_percent_earnings: "222",
          btn: ""
        }
      ]
    };
  },
  computed: {},
  /* eslint-disable */
    created() {
      if (web3.currentProvider.selectedAddress) {
        var addressWallet = web3.currentProvider.selectedAddress;
        this.addressWallet =
          addressWallet.substr(0, 4) +
          "..." +
          addressWallet.substr(addressWallet.length - 4, 4);
        this.isConnect = true;
      }
    },
    watch: {},

    methods: {
      connectWallet() {
        if (window.ethereum) {
          window.web3 = new Web3(ethereum);
          try {
            ethereum
              .enable()
              .then(addressWallet => {
                this.addressWallet =
                  addressWallet[0].substr(0, 4) +
                  "..." +
                  addressWallet[0].substr(addressWallet[0].length - 4, 4);
                this.isConnect = true;
              })
              .catch(error => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        } else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
        } else {
          console.log(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      },
      /* eslint-enable */
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    }
  }
};
</script>
