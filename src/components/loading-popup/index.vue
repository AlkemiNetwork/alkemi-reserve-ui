<template>
  <div>
    <ul id="ul-list-dot">
      <li class="li-list-dot" v-for="item in quality" v-bind:key="item">
        <div
          class="dot-loading"
          v-bind:class="{ 'active-dot': item == number }"
        ></div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "v-loading",
  props: {
    quality: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      number: 1,
      intervalid: ""
    };
  },
  mounted() {
    this.loadings();
  },
  beforeDestroy() {
    clearInterval(this.intervalid);
  },
  methods: {
    loadings() {
      const goble = this;
      this.intervalid = setInterval(function() {
        if (goble.number === goble.quality) {
          goble.number = 1;
        } else goble.number++;
      }, 500);
    }
  }
};
</script>
