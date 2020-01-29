<template>
  <span v-if="transaction" class="small">
    <a class="token-id" :href="buildLink" target="_blank">[view transaction]</a>
  </span>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "clickableTransaction",
  components: {},
  props: {
    transaction: {
      type: String
    }
  },
  computed: {
    ...mapState("ContractController", ["etherscanBase"]),
    buildLink: function() {
      return `${this.etherscanBase}/tx/${this.transaction}`;
    }
  }
};
</script>

<style></style>
