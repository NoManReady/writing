<template>
  <div class="typing-app" id="app">
    <typing-header v-if="headerShow"/>
    <bread-crumb class="w1000" v-if="headerShow" :breadcrumb="breadcrumb"/>
    <transition name="fade" mode="out-in" appear>
        <router-view class="app-content" :class="{appmain:headerShow,w1000:headerShow}"></router-view>
    </transition>
    <loading :loading="loading"/>
  </div>
</template>

<script>
import {
    Store,
    mapGetters,
    mapActions
} from 'vuex';
import TypingHeader from './components/tools/TypingHeader';
import BreadCrumb from './components/tools/BreadCrumb';
import Loading from './components/tools/Loading2';
export default {
    name: 'app',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['loading', 'breadcrumb']),
        headerShow() {
            return this.$route.meta.level > 1;
        }
    },
    components: {
        TypingHeader,
        BreadCrumb,
        Loading
    },
    methods:{
        keydown(e){
            // console.log(e.keyCode);
            // // debugger;
            if((e.keyCode===8&&!_.includes(['TEXTAREA','INPUT'],document.activeElement.tagName))||(e.altKey&&e.keyCode===18)){
                e.preventDefault();
                // return false;
            }
        }
    },
    beforeCreate(){
        if(this.$route.path!='/test'){
            this.$router.replace('/home');
        }
    },
    mounted(){
        document.addEventListener('keydown', this.keydown,false);
    },
    beforeDestoryed(){
    }
}
</script>

<style lang="scss">
    @import './scss/common';
    @import './scss/scrollbar';
    @import './scss/transition';
    #app{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        min-width:1000px;
        font-size:14px;
        overflow:hidden;
        background:repeating-linear-gradient(to bottom,#a9d2fc 0%,#edf6ff 30%,#edf6ff 100%);
        .w1000{
            width:1000px;
            margin-left:auto;
            margin-right:auto;
            border-radius:2px;
            // background-color:#fff;
        }
        .appmain{
            position:relative;
            height:590px;
            background:#f3f9fd;
        }
    }
</style>
