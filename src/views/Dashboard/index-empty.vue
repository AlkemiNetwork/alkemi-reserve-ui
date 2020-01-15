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
              <div class="float-right pr-25">
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
                <b-col md="2" class="pdr-0">
                  <div class="est-content">
                    <div class="title-es-content">EST PORTFOLIO USD VALUE:</div>
                    <div class="monney mb-20">
                      {{ estPortfolioValue | formatMoney }}
                    </div>
                  </div>
                  <div class="est-content">
                    <div class="title-es-content">EST USD EARNINGS 24 hr:</div>
                    <div class="monney mb-20">
                      {{ estEarning | formatMoney }}
                    </div>
                    <div class="title-es-content">CHANGE 24hr:</div>
                    <div v-if="est24h" class="change-number mb-20">
                      {{ est24h | formatPercentSpace }}
                    </div>
                    <div v-else class="null-change-number mb-20">-</div>
                  </div>
                  <div class="est-content">
                    <div class="float-left mr-30">
                      <div class="title-es-content">RESERVES</div>
                      <div class="monney mb-20">
                        {{ reverve | formatNumber }}
                      </div>
                    </div>
                    <div>
                      <div class="title-es-content">POOLS</div>
                      <div class="monney mb-20">{{ pool | formatNumber }}</div>
                    </div>
                  </div>
                </b-col>
                <b-col md="10">
                  <div>
                    <b-card no-body>
                      <b-tabs pills card vertical>
                        <b-tab v-for="(item, key) in data" :key="key">
                          <template v-slot:title>
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img src="/img/omg.svg"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                {{ item.name }}
                                <div class="name-el-money">
                                  {{ item.fullName }}
                                </div>
                              </div>
                              <div class="content-mid">
                                {{ item.total | formatNumber }}
                                <div class="cost">
                                  {{ item.estUSD | formatMoneyReturnNull }}
                                </div>
                              </div>
                              <div class="content-mid">
                                {{ item.fluctuation | transformMoney }}
                                <span v-if="item.fluctuation" class="percent"
                                  >({{ items.change24h | formatPercent }})</span
                                >
                                <div v-if="item.fluctuation" class="cost">
                                  {{ item.estFluctuation | formatMoney }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              {{ test([1213, 23, 3]) }}
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">
                                    {{ item.total | formatNumberReturnZero }}
                                  </div>
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
                                    {{ item.estUSD | formatMoneyHasDola }}
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
                                        v-if="item.change24h"
                                        class="percent"
                                      >
                                        {{ item.change24h | formatPercent }}
                                      </div>
                                      <div v-else class="percent-null">-</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        {{ item.tokenEarning | transformMoney }}
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        {{ item.usdEarning | formatUSDEarning }}
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
                                        ADD DAI POOL
                                      </span>
                                    </div>
                                    <div class="content-modal">
                                      <b-form v-if="isShow == 'form-add'">
                                        <b-form-group
                                          class="text-label text-left"
                                          label="AVAILABLE DAI BALANCE"
                                          label-for="input-1"
                                        >
                                          <b-form-input
                                            class="value-available"
                                            type="text"
                                            value="10,332.78"
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
                                            placeholder="0.00"
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
                                          <div
                                            class="choose-date"
                                            @click="showCalendar"
                                          >
                                            <span>{{ dayChoose }}</span>
                                            <b-img
                                              src="/img/arrow-down-sign-to-navigate.png"
                                            ></b-img>
                                          </div>
                                        </b-form-group>
                                        <b-button
                                          class="btn-submit btn-modal-add-new"
                                          @click="loading"
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
                                  <b-table
                                    fixed
                                    :fields="fields"
                                    :items="item.table"
                                    show-empty
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
                                    <template slot="empty">
                                      <div class="text-center empty-row">
                                        You Currently Have No Active Pools
                                      </div>
                                    </template>
                                  </b-table>
                                </div>
                              </div>
                            </template>
                          </b-card-text>
                        </b-tab>
                        <b-tab>
                          <template v-slot:title>
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img src="/img/dai.svg"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                DAI
                                <div class="name-el-money">Maker Dai</div>
                              </div>
                              <div class="content-mid">
                                -
                                <!-- <div class="cost">$89,344.44</div> -->
                              </div>
                              <div class="content-mid">
                                -
                                <!-- +22384.44 <span class="percent">(6.54%)</span>
                                <div class="cost">$334.54</div> -->
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">0.00</div>
                                  <span class="acronym-name">
                                    OMG |
                                    <span class="el-name"> Omise GO</span>
                                  </span>
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    $0.00 |
                                    <span class="text-est"> EST USD VALUE</span>
                                  </div>
                                </div>
                                <div class="chart-line">
                                  <div class="info-chart">
                                    <div class="value-change float-left">
                                      24 HR CHANGE
                                      <div class="percent">-</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        -
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        -
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
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img src="/img/eos.svg"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                EOS
                                <div class="name-el-money">EOS</div>
                              </div>
                              <div class="content-mid">
                                -
                                <!-- <div class="cost">$283,382.00</div> -->
                              </div>
                              <div class="content-mid">
                                -
                                <!-- +12443.23 <span class="percent">(8.56%)</span>
                                <div class="cost">$12,754.53</div> -->
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">0.00</div>
                                  <span class="acronym-name">
                                    OMG |
                                    <span class="el-name"> Omise GO</span>
                                  </span>
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    $0.00
                                    <span class="line-vertical-14">|</span>
                                    <span class="text-est">EST USD VALUE</span>
                                  </div>
                                </div>
                                <div class="chart-line">
                                  <div class="info-chart">
                                    <div class="value-change float-left">
                                      24 HR CHANGE
                                      <div class="percent">-</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        -
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        -
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
                            <div class="tab-flex">
                              <div class="content-mid-img">
                                <b-img src="/img/mkr.svg"></b-img>
                              </div>
                              <div class="acronym-name content-mid">
                                MKR
                                <div class="name-el-money">Maker</div>
                              </div>
                              <div class="content-mid">
                                -
                                <!-- 65,844.57
                                <div class="cost">$23,003.90</div> -->
                              </div>
                              <div class="content-mid">
                                -
                                <!-- +1443.22 <span class="percent">(3.23%)</span>
                                <div class="cost">$334.54</div> -->
                              </div>
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">0.00</div>
                                  <span class="acronym-name">
                                    OMG |<span class="el-name"> Omise GO</span>
                                  </span>
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    $0.00 |
                                    <span class="text-est"> EST USD VALUE</span>
                                  </div>
                                </div>
                                <div class="chart-line">
                                  <div class="info-chart">
                                    <div class="value-change float-left">
                                      24 HR CHANGE
                                      <div class="percent">-</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        -
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        -
                                      </div>
                                    </div>
                                    <div class="clearfix"></div>
                                  </div>
                                  <chart :options="chartOptionsLine"></chart>
                                </div>
                              </div>
                            </template>
                          </b-card-text>
                        </b-tab>
                        <b-tab>
                          <template v-slot:title>
                            <div class="tab-flex">
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
                            </div>
                          </template>
                          <b-card-text>
                            <template>
                              <div>
                                <div class="info-value">
                                  <div class="value float-left">0.00</div>
                                  <span class="acronym-name">
                                    OMG |
                                    <span class="el-name"> Omise GO</span>
                                  </span>
                                  <div class="clearfix"></div>
                                  <div class="est-value">
                                    $0.00 |
                                    <span class="text-est"> EST USD VALUE</span>
                                  </div>
                                </div>
                                <div class="chart-line">
                                  <div class="info-chart">
                                    <div class="value-change float-left">
                                      24 HR CHANGE
                                      <div class="percent">-</div>
                                    </div>
                                    <div class="value-change float-left">
                                      TOKEN EARNINGS
                                      <div class="est-value-change">
                                        -
                                      </div>
                                    </div>
                                    <div class="value-change float-left">
                                      USD VALUE EARNINGS
                                      <div class="est-value-change">
                                        -
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
    </b-container>
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
import Web3 from "web3";
import { FunctionalCalendar } from "vue-functional-calendar";
import loadingPopup from "../../components/loading-popup/index";
import accounting from "accounting";
const moment = require("moment");
export default {
  name: "test",
  components: {
    FunctionalCalendar,
    loadingPopup
  },
  data() {
    return {
      isShow: "form-add",
      isConnect: false,
      addressWallet: "",
      dayChoose: "",
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
            data: []
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
      estPortfolioValue: 0,
      estEarning: 0,
      est24h: 0,
      reverve: 0,
      pool: 0,
      data: [
        {
          name: "OMG",
          fullName: "Omise GO",
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
          name: "OMG",
          fullName: "Omise GO",
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
          name: "OMG",
          fullName: "Omise GO",
          total: 0,
          estUSD: 0,
          fluctuation: 0,
          estFluctuation: 0,
          change24h: 0,
          tokenEarning: 0,
          usdEarning: 0,
          table: []
        }
      ]
    };
  },
  created() {
    if (window.web3.currentProvider.selectedAddress) {
      var addressWallet = window.web3.currentProvider.selectedAddress;
      this.addressWallet =
        addressWallet.substr(0, 4) +
        "..." +
        addressWallet.substr(addressWallet.length - 4, 4);
      this.isConnect = true;
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
    connectWallet() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          window.ethereum.enable().then(addressWallet => {
            this.addressWallet =
              addressWallet[0].substr(0, 4) +
              "..." +
              addressWallet[0].substr(addressWallet[0].length - 4, 4);
            this.isConnect = true;
          });
        } catch (error) {
          console.log(error);
        }
      } else if (window.web3) {
        // window.web3 = new Web3(web3.currentProvider);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
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
        this.dayChoose = moment(data.date, "DD/MM/YYYY").format("DD MMM YYYY");
        this.isShow = "form-add";
      }
      return false;
    },
    loading() {
      this.isShow = "loading";
      setTimeout(() => {
        this.isShow = "form-add";
        return this.hideModal();
      }, 4000);
      // clearTimeout(timerid);
    },
    test(data) {
      console.log(data);
      this.chartOptionsLine.series.data = data;
    }
  }
};
</script>
