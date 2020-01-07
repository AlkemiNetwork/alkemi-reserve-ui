<template>
 <div>
     <b-row>
       <b-col lg="12">
         <b-row class="head d-flex align-items-center">
           <b-col md="6">
            <div class="pull-left pl-35">
              <img src="img/alkemi-logo-horizontal-all-white.svg" alt="Alkemi"/>
              <span class="vertical-line"> | </span>
              <span class="cl-text-banner">Liquidity Reserve Dashboard</span>
            </div>
          </b-col>
          <b-col md="6">
            <div class="pull-right pr-35">
              <b-button-group>
                <b-button variant="akm">Connect</b-button>
              </b-button-group>
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
                <div class="pull-left mr-30">
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
                        <b-img src="/img/omg.svg"></b-img>
                        <div class="acronym-name">OMG 
                          <div class="name-el-money">Omise GO</div>
                        </div>
                        <div>120,000.34
                          <div>$9344.44</div>
                        </div>
                      </template>
                      <b-card-text>Tab contents 1</b-card-text>
                    </b-tab>
                    <b-tab title="Tab 2"><b-card-text>Tab contents 2</b-card-text></b-tab>
                    <b-tab title="Tab 3"><b-card-text>Tab contents 3</b-card-text></b-tab>
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

const moment = require('moment');


export default {
  name: 'dashboard',
  components: {
  
  },
  data() {
    return {
      
    }
  },
  computed: {


  },
  created() {
    
  },
  watch: {
   
  },

  methods: {
   
  }
}
</script>
