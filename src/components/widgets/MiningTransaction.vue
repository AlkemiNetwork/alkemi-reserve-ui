<template>
    <b-modal
      hide-footer
      hide-header
      v-if="miningTransactionObject.status != null"
      ref="modal-loading"
      title="Using Component Methods"
      id="modal-loading"
      v-model="showDialog"
      centered
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close 
   >
      <div class="content-modal">
        <div class="processing">
          <div v-if="miningTransactionObject.status != null">
            <div v-if="miningTransactionObject.status == 'uploading'" class="title-process">
              Uploading content to IPFS
            </div>
            <div v-if="miningTransactionObject.status == 'pending'" class="title-process">
              Pending Transaction
            </div>
            <div v-if="miningTransactionObject.status == 'done'" class="title-process">
              Transaction Mined
            </div>
            <div v-if="miningTransactionObject.status == 'done'">
              Transaction has been mined! You can view the transaction info on
              EtherScan
              <clickable-transaction :transaction="miningTransactionObject.txHash" />.
            </div>
            <div class="address-transaction">
              {{ dotDotDot(miningTransactionObject.txHash) }}
            </div>
            <loadingPopup v-if="(miningTransactionObject.status == 'pending') || (miningTransactionObject.status == 'uploading')" :quality="4"></loadingPopup>
            <b-button-group v-if="miningTransactionObject.status == 'done'">
              <b-button @click="modalClosed" variant="akm">
                Close
              </b-button>
            </b-button-group>
          </div>
        </div>
      </div>
    </b-modal>
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
    showDialog: true,
  }),
  computed: {
    ...mapState("ContractController", [
      "etherscanBase",
      "miningTransactionObject"
    ])
  },
  /*watch: {
    miningTransactionObject: function(miningTransObject) {
      if (miningTransObject.status !== null) {
        this.showModalLoading()
      } else {
        this.hideModalLoading()
      }
    }
  },*/
  methods: {
    ...mapActions("ContractController", [
      "CLOSE_MINING_DIALOG"
    ]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    },
    /*showModalLoading() {
      this.$refs["modal-loading"].show()
    },
    hideModalLoading() {
      this.$refs["modal-loading"].hide()
      this.CLOSE_MINING_DIALOG();
    },*/
    dotDotDot: function(tx) {
      if (tx) {
        return (
            tx.substr(0, 6) +
            "..." +
            tx.substr(
              tx.length - 6,
              tx.length
            )
          )
      }
      else {
        return ""
      }
    },
  }
};
</script>

<style></style>
