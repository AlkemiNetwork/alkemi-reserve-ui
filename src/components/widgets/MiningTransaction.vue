<template>
  <div class="toastTransaction" v-if="miningTransactionObject.status != null">
    <b-toast id="example-toast" v-model="showToastTransaction" static no-auto-hide no-close-button>
        <template>
          <div class="toastProcessing">
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
              <div class="w-100 text-center mt-25">
                <b-spinner v-if="(miningTransactionObject.status == 'pending') || (miningTransactionObject.status == 'uploading')"></b-spinner>
              </div>
              <b-button-group v-if="miningTransactionObject.status == 'done'">
                <b-button @click="modalClosed" variant="akm">
                  Close
                </b-button>
              </b-button-group>
            </div>
          </div>
        </template>
    </b-toast>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ClickableTransaction from "@/components/widgets/ClickableTransaction";
export default {
  name: "miningTransaction",
  components: { 
    ClickableTransaction,
  },
  data: () => ({
    showDialog: true,
    showToastTransaction: true,
  }),
  computed: {
    ...mapState("ContractController", [
      "etherscanBase",
      "miningTransactionObject"
    ])
  },
  methods: {
    ...mapActions("ContractController", [
      "CLOSE_MINING_DIALOG"
    ]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    },
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
