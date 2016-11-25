<template>
  <div class="app">
    <HeaderComponent/>
    <div class="container">
      <transition :name="slide" mode="out-in">
        <!-- <keep-alive> -->
          <router-view></router-view>
        <!-- </keep-alive> -->
      </transition>
    </div>
    <FooterComponent/>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
import HeaderComponent from './components/Header';
import FooterComponent from './components/Footer';
export default {
  name: 'app',
  data(){
    return {
      routes:Object.freeze(['/home','/upload','/canvas','/timeinput','/echatline']),
      slide:'',
      router:''
    }
  },
  watch:{
    '$route':function(v){
      this.SET_TITLE(v.name);
    },
  },
  components:{
    HeaderComponent,
    FooterComponent
  },
  methods:{
    ...mapMutations(['SET_TITLE']),
    keyDirection(e){
      let index=this.routes.indexOf(this.$route.path);
      if(index<0){
        return;
      }
      switch(e.keyCode){
        // case 38:
        case 37:
        this.slide='slide-right';
        this.$router.push(this.routes[index===0?this.routes.length-1:index-1]);
        break;
        case 39:
        // case 40:
        this.slide='slide-left';
        this.$router.push(this.routes[index===this.routes.length-1?0:index+1]);
        break;
      }
    },
  },
  beforeRouteEnter(to,from,next){

  },
  mounted(){
    this.SET_TITLE(this.$route.name);
    document.addEventListener('keydown', this.keyDirection, false);
  },
  beforeDestory(){
    document.removeEventListener('keydown', this.keyDirection);
  }
};
</script>

<style lang="scss">
@import './scss/reset';
@import './scss/rippler';
@import './scss/transition';
.app{
  width:$containerWidth;
  height:$containerHeight;
  font-size:16px;
  display: flex;
  flex-direction:column;
  color:$white;
  .container{
    flex:1;
    overflow:hidden;
    overflow-y: scroll;
    order:2;
    color:#333;
    position: relative;
  }
}
</style>
