<template>
    <div class="medal-index">
        <h2 class="medal-title">
            我的勋章
        </h2>
        <div class="medal">
            <div class="medal-header">
                已获勋章<span class="count">&nbsp;{{medalList.reward_medal_info_list.length}}&nbsp;</span>枚
            </div>
            <div class="medal-body">
                <div v-if="medalList.reward_medal_info_list.length > 0">
                    <a :class="{available:topIndex>0}" href="javascript: void(0);" class="prev" @click="prev">&lt;</a>
                    <div class="e-list">
                        <ul :style="{marginLeft:marginLeft+'px'}">
                            <li v-for="item in medalList.reward_medal_info_list">
                                <div class="medal-item">
                                    <img :src="item.bpic" :title="item.name">
                                </div>
                            </li>
                        </ul>
                    </div>
                    <a :class="{available:topIndex<(medalList.reward_medal_info_list.length/6-1)}"
                       href="javascript: void(0);" class="next" @click="next">&gt;</a>
                </div>
                <div v-if="medalList.reward_medal_info_list.length <= 0">
                    <p class="medal-empty">暂无勋章</p>
                </div>
            </div>
        </div>
        <div class="medal">
            <div class="medal-header">
                未获勋章<span class="count">&nbsp;{{medalList.un_reward_medal_info_list.length}}&nbsp;</span>枚
            </div>
            <div class="medal-body">
                <div v-if="medalList.un_reward_medal_info_list.length > 0">
                    <a :class="{available:bottomIndex>0}" href="javascript: void(0);" class="prev" @click="prev2">
                        &lt;</a>
                    <div class="e-list">
                        <ul :style="{marginLeft:marginLeft2+'px'}">
                            <li v-for="item in medalList.un_reward_medal_info_list">
                                <div class="medal-item">
                                    <img :src="item.bpic" :title="item.name">
                                </div>
                            </li>
                        </ul>
                    </div>
                    <a :class="{available:bottomIndex<(medalList.un_reward_medal_info_list.length/6-1)}"
                       href="javascript: void(0);" class="next" @click="next2">&gt;</a>
                </div>
                <div v-if="medalList.un_reward_medal_info_list.length <= 0">
                    <p class="medal-empty">暂无勋章</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: 'Modal',
        data () {
            return {
                marginLeft: 0,
                marginLeft2: 0,
                topIndex: 0,
                bottomIndex: 0
            };
        },
        created () {
            setTimeout(() => {
                this.getData();
            }, 300);
        },
        methods: {
            ...mapActions(['my_medal']),
            prev(el){
                if (this.topIndex == 0)
                    return;

                this.topIndex--;
                this.marginLeft += 666;
            },
            next(el){
                if (this.topIndex >= (this.medalList.reward_medal_info_list.length / 6 - 1))
                    return;
                this.topIndex++;
                this.marginLeft -= 666;
            },
            prev2(el){
                if (this.bottomIndex == 0)
                    return;

                this.bottomIndex--;
                this.marginLeft2 += 666;
            },
            next2(el){
                if (this.bottomIndex >= (this.medalList.un_reward_medal_info_list.length / 6 - 1))
                    return;
                this.bottomIndex++;
                this.marginLeft2 -= 666;
            }
        },
        computed: {
            ...mapGetters(['medalList']),
        },
        created(){
            this.my_medal();
        }
    };
</script>

<style lang="scss" scoped>
    @import './scss/medal';
</style>
