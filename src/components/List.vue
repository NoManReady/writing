<template>
  <div class="list-container">
    <button @click="shuffle" class="shuffle" v-swing>shuffle</button>
    <transition-group name="shuffle" class="list" tag="div" appear>
      <div class="item" v-for="(l,i) in list" :key="l" :style="{'color':l}" v-swing>{{l}}</div>
    </transition-group>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'list',
    data() {
        return {
            list:Array.apply(null,{length:512}).map((l,i)=>{let string16=(i*8).toString(16);return `#${_.repeat(0,3-string16.length)}${string16}`;})
        };
    },
    components: {

    },
    methods: {
        shuffle() {
            this.list = _.shuffle(this.list);
        }
    },
    created() {

    },
    mounted() {}
};

</script>

<style lang="scss">
@import '../scss/layout';
@import '../scss/color';
.shuffle-enter-active,.shuffle-leave-active{
  transition:all .3s;
}
.shuffle-enter,.shuffle-leave-active{
  opacity: .3;
  transform:translateX(30px);
}
.shuffle-move{
  transition:transform 1s;
}
.list-container{
  font-size:14px;
  width:80%;
  margin:0 auto;
  display:flex;
  flex-direction:column;
  .shuffle{
    margin:1em 0;
    padding:.5em 1em;
    border-radius:2px;
    background-color:$vueColor;
    outline:none;
    border:1px solid darken($vueColor,5%);
    color:$white;
  }
  .list{
    display:flex;
    flex:1;
    flex-flow:row wrap;
    justify-content: space-between;
    .item{
      margin-bottom: 1em;
      flex: 0 0 24%;
      border: 1px solid #eee;
      border-radius: 3px;
      padding: 1em;
      display:flex;
      align-items:center;
      justify-content:center
    }
  }
}
@media screen and (max-width:750px){
  .container{
    font-size:12px;
    width:90%;
    .list{
      flex-direction:column;
      .item{
        flex:1 1 100%;
      }
    }
  }
}
</style>
