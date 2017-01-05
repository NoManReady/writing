<template>
    <div class="typing-header">
        <div class="banner">
            <img class="banner-logo" src="../../assets/logo.png" alt="logo">
            <span class="banner-title">ND打字测试软件</span>
        </div>
        <popover ref="userInfo">
            <user-info/>
        </popover>
        <div class="user-info" v-popover:userInfo>
            <i class="u-tip"></i>
            <span class="u-name">{{loginUser.display_name}}</span>
            <i class="caret-down"></i>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import Popover from './Popover';
import UserInfo from './UserInfo';
export default {
    computed: {
        ...mapGetters(['loginUser'])
    },
    components: {
        UserInfo,
        Popover
    }
}
</script>
<style lang="scss">
@import "../../scss/mixins";
$height: 60px;
.typing-header {
    padding: 0 20px;

    color: #fff;
    background: linear-gradient(to bottom, #38adff,#5ebbfc);
    @extend %clearfix;
    .banner {
        @include text-middle($height);
    }
    .banner {
        float: left;
    }
    .banner-logo {
        width: 32px;
        height: 32px;

        vertical-align: middle;
    }
    .banner-title {
        margin-left: 12px;

        font-size: 18px;
        vertical-align: middle;
    }
    .user-info {
        float: right;
        position: relative;

        margin-right: 150px;
        padding-top: $height/2-10px;
        width: 200px;
        height: $height;

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
