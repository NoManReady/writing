<template>
    <div class="user-popover">
        <div class="u-panel">
            <img :src="loginUser.user_icon" alt="" class="u-avatar" @error="onError($event)">
            <div class="u-info">
                <h3 class="u-welcome">欢迎您</h3>
                <span class="u-name" :title="loginUser.display_name">{{loginUser.display_name}}</span>
                <a class="logout" href="javascript:;" @click="logout">注销</a>
            </div>
        </div>
        <div class="u-honor">
            <a class="honor-item" @click="openModal(0)">
                <img class="houor-icon" src="../../assets/honor.png" alt="勋章">
                <span class="h-name">我的勋章</span>
            </a>
            <a class="honor-item" @click="openModal(1)">
                <img class="houor-icon" src="../../assets/couve.png" alt="曲线">
                <span class="h-name">进步曲线</span>
            </a>
        </div>
        <modal @nd-modal-close="modalClose" :visible="modalShow" :spaceClose="true" modalClass="nopadding" title="我的打字情况">
            <user-modal :type="type"></user-modal>
        </modal>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex';
import UserModal from '../personal/index';
import Modal from './Modal';
export default {
    data() {
            return {
                type: -1,
                modalShow: false
            }
        },
        computed: {
            ...mapGetters(['loginUser'])
        },
        components: {
            Modal,
            UserModal
        },
        methods: {
            openModal(type) {
                this.type = type;
                this.modalShow = true;
            },
            modalClose() {
                this.modalShow = false;
            },
            logout() {
                window.location.href = window.logoutUrl;
            },
            onError(evt) {
                evt.target.src = require('assets/avatar.png');
            }
        }
}
</script>
<style lang="scss" scoped>
@import "../../scss/mixins";
.user-popover {
    width: 175px;
    .u-panel {
        border-bottom: 1px solid #dfe1e5;
        padding-bottom: 10px;
    }
    .u-avatar,
    .u-info {
        display: inline-block;

        vertical-align: middle;
    }
    .u-avatar {
        margin-right: 8px;
        border-radius: 50%;
        width: 56px;
        height: 56px;

        vertical-align: top;
    }
    .u-info {
        width: 100px;
        .u-name,
        .u-welcome {
            margin: 0;
            margin-bottom: 5px;
        }
        .u-name {
            display: block;

            width: 100%;
            height: auto;

            line-height: 1;

            color: #2e3033;

            @extend %text-overflow;
        }
        .u-welcome {
            font-size: 14px;
            font-weight: normal;

            color: #8a9199;
        }
        .logout {
            display: inline-block;
            float: right;

            text-decoration: none;

            color: #60b9ff;
            &:hover {
                color: darken(#60b9ff,5%);
            }
        }
    }
    .u-honor {
        width: 100%;

        text-align: center;

        color: #8a9199;

        @extend %clearfix;
        .honor-item {
            float: left;

            margin-top: 10px;
            width: 50%;

            cursor: pointer;
            &:hover {
                color: #38adff;
            }
        }
        .houor-icon {
            display: block;

            margin: 0 auto 10px;
        }
    }
}
</style>
