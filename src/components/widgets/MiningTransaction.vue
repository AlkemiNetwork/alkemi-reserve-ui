<template>
  <div v-if="miningTransactionObject.status != null" class="processing" style="background-color: #DEDDDE;width:600px">
    <div>
      <div v-if="miningTransactionObject.status == 'uploading'" class="title-process">
        Uploading content to IPFS
      </div>
      <div v-if="miningTransactionObject.status == 'pending'" class="title-process">
        Pending Transaction
      </div>
      <div v-if="miningTransactionObject.status == 'done'" class="title-process">
        Transaction Mined
      </div>
      <loadingPopup v-if="(miningTransactionObject.status == 'pending') || (miningTransactionObject.status == 'uploading')" :quality="4"></loadingPopup>
      <div style="padding:30px" v-if="miningTransactionObject.status == 'done'">
        Transaction has been mined! You can view the transaction info on
        EtherScan
        <clickable-transaction :transaction="miningTransactionObject.txHash" />.
      </div>
      <div class="address-transaction">
        {{ miningTransactionObject.txHash }}
      </div>
      <b-button-group v-if="miningTransactionObject.status == 'done'">
        <b-button @click="modalClosed" variant="akm">
          Close
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ClickableTransaction from "@/components/widgets/ClickableTransaction";
import loadingPopup from "../../components/loading-popup/index";
export default {
  name: "miningTransaction",
  components: { 
    ClickableTransaction,
    loadingPopup 
  },
  data: () => ({
    showDialog: true
  }),
  methods: {
    ...mapActions("ContractController", [
      "CLOSE_MINING_DIALOG"
    ]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    }
  },
  computed: {
    ...mapState("ContractController", [
      "etherscanBase",
      "miningTransactionObject"
    ])
  }
};
</script>

<style></style>
