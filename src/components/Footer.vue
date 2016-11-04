<template>
  <div class="footer" v-swing>
footer
  </div>
</template>

<script>
export default {
  name: 'footer',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed:{
    list(){
      return this.$store.state.articles;
    }
  },
  mounted(){
  }
};
</script>

<style lang="scss">
@import '../scss/layout';
@import '../scss/color';
.footer{
  height:$bannerHeight;
  order:3;
  background-color:$vueColor;
  text-align:center;
  line-height:$bannerHeight;
  font-size:1.5rem;
}
</style>
