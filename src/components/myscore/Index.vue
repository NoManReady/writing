<template>
    <div class="myscore">
        <div class="left-panel">
            <div class="left-panel-header">
                <div class="p-icon"><img :src="loginUser.user_icon"></div>
                <span>{{loginUser.display_name}}</span>
            </div>
            <div class="left-panel-bottom">
                <ul>
                    <li v-for="item in myMedalList">
                        <img :class="{rubberBand:item.is_new}" :src="item.pic" :title="item.name">
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-panel">
            <div class="right-panel-tab">
                <ul>
                    <li @click="mode=1" :class="{active:mode==1}">我的成绩</li>
                    <li @click="mode=2" :class="{active:mode==2}">我的排行榜</li>
                </ul>
            </div>
            <keep-alive>
                <component :is="currentComponent"></component>
            </keep-alive>
        </div>
        <a class="close" :class="{active:mode==2}" @click="$emit('close')" href="javascript:;">&times;</a>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import score from './score';
    import rank from  './rank';
    export default {
        name: 'myscore',
        data(){
            return {
                mode: 1
            }
        },
        computed: {
            ...mapGetters(['myMedalList', 'loginUser']),
            currentComponent(){
                return this.mode == 1 ? score : rank;
            }
        }
    }
</script>
<style lang="scss">
    @import './scss/index';
</style>
