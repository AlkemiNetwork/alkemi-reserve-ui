<template>
  <div>
    <ul id="ul-list-dot">
      <li class="li-list-dot" v-for="item in quality" v-bind:key="item">
        <div class="dot-loading"></div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "v-loading",
  props: {
    quality: Number
  },
  data() {
    return {};
  },
  created() {
    console.log(this.quality);
  }
};
</script>
