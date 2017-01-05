<template>
  <div class="typing-home">
      <popover ref="userInfo">
          <user-info/>
      </popover>
      <div class="lll">
      <div class="user-info" v-popover:userInfo>
          <i class="u-tip"></i>
          <span class="u-name">{{loginUser.display_name}}</span>
          <i class="caret-down"></i>
      </div>
      </div>
    <div class="home-header">
        <img class="logo" src="../../assets/logo.png" alt="logo">
        <p class="title">欢迎使用ND打字测试软件</p>
    </div>
    <div class="mode-block">
        <div v-for="(mode,index) in modeHash" class="mode-item" :style="{backgroundImage:`url(${mode.img})`}" :key="index">
            <a @click="modeClick(mode.mode)">{{mode.name}}</a>
        </div>
    </div>
  </div>
</template>
<script>
import userinfo from '../tools/UserInfo';
import popover from '../tools/Popover';

import {
    mapGetters,
    mapActions
} from 'vuex';
export default {
    name: 'typingMode',
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['modeHash','loginUser'])
    },
    methods: {
        ...mapActions(['set_mode']),
        modeClick(mode) {
            this.set_mode(mode);
            this.$nextTick(() => {
                this.$router.replace('/articles');
            });
        }
    },
    components:{
        'user-info':userinfo,
        'popover':popover
    }
}
</script>
<style lang="scss" scoped>
@import "../../scss/mixins";
.typing-home {
    text-align: center;

    color: #fff;
    background: url(../../assets/1920.jpg) center center no-repeat;
    background-size: cover;

    @extend %position-absolute;
    .home-header {
        margin-top: 130px;
        .logo {
            width: 47px;
            height: 54px;
        }
        .title {
            font-size: 24px;
        }
    }
    $blockSize: 238px;
    .mode-block {
        margin-top: 100px;
        .mode-item {
            display: inline-block;

            width: $blockSize;
            height: $blockSize;

            font-size: 32px;
            line-height: 136px;
            text-align: center;
            a {
                display: block;

                margin-left: 57px;
                width: 141px;
                height: 141px;

                cursor: pointer;
                &:hover {
                    color: darken(#fff,10%);
                }
            }
        }
    }
.lll{
    position: absolute;
    top:0;
    width: 100%;
    padding: 0 20px;
    height: 60px;
}
    .user-info {
        float: right;
        position: relative;

        margin-right: 150px;
        padding-top: 60px/2-10px;
        width: 200px;
        height: 60px;

        text-align: center;

        cursor: pointer;
        &:hover {
             background-color: rgba(#67bffd,.8);
         }
    }
    .u-tip,
    .u-name,
    .caret-down {
        display: inline-block;

        margin-left: 5px;

        vertical-align: middle;
    }
    .u-tip {
        width: 20px;
        height: 20px;

        background: url(../../assets/person.png) center no-repeat;
    }
    .u-name {
        width: 100px;

    @extend %text-overflow;
    }
    .caret-down {
        width: 14px;
        height: 14px;

        text-align: center;

        background: url(../../assets/arrowd.png) center no-repeat;
    }
}

</style>
