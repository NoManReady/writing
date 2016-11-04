<template>
  <div class="header" v-swing="color" @click="changeColor">
    <h2 class="header-banner">{{banner}}</h2>
    <div class="router-view">
      <transition name="slide-down">
        <span :key="title">{{title}}</span>
      </transition>
    </div>
    <ul class="header-nav"></ul>
    <div class="header-tool"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'header',
  data() {
    return {
      banner: 'NoManReady',
      color:'green'
    };
  },
  computed:{
    ...mapGetters(['title']),
  },
  methods:{
    changeColor(){
      this.color='red';
    }
  },
  mounted(){

  }
};
</script>

<style lang="scss">
@import '../scss/layout';
@import '../scss/color';
@import '../scss/transition';
.header{
  display: flex;
  background-color:lighten($themeColor,10%);
  height:$bannerHeight;
  align-items: center;
  .header-banner{
    flex:0 0 10rem;
    padding-left:2rem;
    font-size:150%;
  }
  .router-view{
    flex:0 0 10rem;
    display:flex;
    align-items:center;
    justify-content:center;
    position: relative;
    padding-left:5rem;
    span{
      color:$vueColor;
      font-weight:bold;
      display:flex;
      align-items:center;
      justify-content:center;
      min-width:8rem;
      background-color: lighten(black,20%);
      border-radius: 4px;
      padding: .3em .5em;
    }
  }
}
</style>
