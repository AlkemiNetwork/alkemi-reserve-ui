<template>
  <div v-if="miningTransactionObject.status!=null" class="text-center">
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ClickableTransaction from "@/components/widgets/ClickableTransaction";
export default {
  name: "miningTransaction",
  components: { ClickableTransaction },
  data: () => ({
    showDialog: true
  }),
  methods: {
    ...mapActions(["CLOSE_MINING_DIALOG"]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    }
  },
  mounted() {
  },
  computed: {
    ...mapState("ContractController", [
      "etherscanBase",
      "miningTransactionObject"
    ])
  }
};
</script>

<style>
</style>