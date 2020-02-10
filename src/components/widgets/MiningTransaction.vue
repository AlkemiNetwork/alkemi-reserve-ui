 <!--<template>
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
-->
<template>
  <div>
    <!-- coming soon -->
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import iconComment from '../Icons/comment'
export default {
  components: {
    'iconComment' : iconComment,
  },
  data() {
    return {
      showDialog: true,
      showToastTransaction: true,
    }
  },
  computed: {
    ...mapState("ContractController", [
      "etherscanBase",
      "miningTransactionObject",
      "statusTransaction"
    ])
  },
  watch: {
    statusTransaction: function(miningTransObj){
      if(miningTransObj.status == "processing"){
        this.popToastProcess();
      }else if (miningTransObj.status == "approve"){
        this.popToastApprove();
      }else if(miningTransObj.status == "success"){
        this.popToastSuccess();
      }else if (miningTransObj.status == "fails"){
        this.popToastError();
      }
      else if(miningTransObj.status=="Claimsuccess"){
        this.popToastClaimSuccess();
      }
    }
  },
  methods: {
    ...mapActions("ContractController", [
      "CLOSE_MINING_DIALOG"
    ]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    },
    buildLink: function() {
      return `${this.etherscanBase}/tx/${this.miningTransactionObject.txHash}`;
    },
    async popToastProcess() {
      this.$bvToast.hide('toastProcess')
      const h = this.$createElement
      const vNodesMsg = h(
        'div',
        { class: ['text-center', 'mb-0', 'toastr-flex'] },
        [
          h('b-spinner'),
          h('div', {class: "text-toast"}, 'PROCESSING TRANSACTION')
        ]
      )
       this.$bvToast.toast([vNodesMsg], {
        id: "toastProcess",
        toastClass: "toastProcess",
        noCloseButton: true,
        noHoverPause: true,
        noAutoHide: true,
      })
      this.$bvToast.hide('toastApprove')
      this.$bvToast.hide('toastSuccess')
      this.$bvToast.hide('toastError')
      this.$bvToast.hide('toastClaimSuccess')
    },
    async popToastApprove() {
      const h = this.$createElement
      const vNodesMsg = h(
        'div',
        { class: ['text-center', 'mb-0', 'toastr-flex'] },
        [
          h('i', { class : "fas fa-check"}),
          h('div', { class: "text-toast"}, 'TRANSACTION COMPLETE'),
        ]
      )
      this.$bvToast.toast([vNodesMsg], {
        id: "toastApprove",
        toastClass: "toastApprove",
        noHoverPause: true,
        noAutoHide: true,
      })
      this.$bvToast.hide('toastProcess')
      this.$bvToast.hide('toastSuccess')
      this.$bvToast.hide('toastError')
    },
    async popToastSuccess() {
      const h = this.$createElement
      const vNodesMsg = h(
        'div',
        { class: ['mb-0'] },
        [
          h('i', { class : "fas fa-check"}),
          h('div', { class: "text-toast"}, 'RESERVE CREATED'),
          h('div', { class : "clearfix" }),
          h('b-link', { props: {href: `${this.buildLink()}`, target: '_blank'} }, 'View Transaction' )
        ]
      )
       this.$bvToast.toast([vNodesMsg], {
        id: "toastSuccess",
        toastClass: "toastSuccess",
        noHoverPause: true,
        noAutoHide: true,
      })
      this.$bvToast.hide('toastProcess')
      this.$bvToast.hide('toastApprove')
      this.$bvToast.hide('toastError')
    },
    async popToastClaimSuccess() {
      const h = this.$createElement
      const vNodesMsg = h(
        'div',
        { class: ['mb-0'] },
        [
          h('i', { class : "fas fa-check"}),
          h('div', { class: "text-toast"}, 'CLAIM SUCCESS'),
          h('div', { class : "clearfix" }),
          h('b-link', { props: {href: `${this.buildLink()}`, target: '_blank'} }, 'View Transaction' )
        ]
      )
       this.$bvToast.toast([vNodesMsg], {
        id: "toastClaimSuccess",
        toastClass: "toastSuccess",
        noHoverPause: true,
        noAutoHide: true,
      })
      this.$bvToast.hide('toastProcess')
      this.$bvToast.hide('toastApprove')
      this.$bvToast.hide('toastError')
    },
    async popToastError() {
      const h = this.$createElement
      const vNodesMsg = h(
        'div',
        { class: ['mb-0'] },
        [
          h('iconComment', { props : {}}),
          h('div', { class: "text-toast"}, 'TRANSACTION FAILED'),
          h('div', { class: "text-mess-toast"}, 'Insufficient Funds'),
          h('div', { class : "clearfix" }),
         
        ]
      )
       this.$bvToast.toast([vNodesMsg], {
        id: "toastError",
        toastClass: "toastError",
        noHoverPause: true,
        noAutoHide: true,
      })
      this.$bvToast.hide('toastProcess')
      this.$bvToast.hide('toastApprove')
      this.$bvToast.hide('toastSuccess')
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
  },
}
</script>
