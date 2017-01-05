<script
    src="../../../../../boss/elearn_base_s1_e_101_com/auxo/component/js-enroll-status/v1.0.0/enrollstatus.js"></script>
<link rel="stylesheet"
      href="../../../../../boss/elear_base_pre_r_s1_e_99_com/auxo/front/mystudy/scss/shared/_iconfont.scss">
<template>
    <div class="myrank-conent" v-if="!loading">
        <div class="myrank-c-t"
             v-if="rankList.print_type_rank.length || rankList.article_type_rank.length || rankList.article_rank.length">
            <div class="myrank-list fl">
                <span class="bg">我</span>
                <label>我的输入法</label>
                <p>{{allStatisticData.name | filter2}}</p>
                <ul v-if="allStatisticData.name!='--'">
                    <li v-for="(item,index) in rankList.print_type_rank">
                        <span class="td1"
                              :class="{top1:item.rank==1,top2:item.rank==2,top3:item.rank==3}">{{item.rank | filter1}}</span>
                        <span class="td2" :class="{blue:item.user_id==loginUser.user_id}">
                            <img :src="item.icon">&nbsp;{{item.display_name}}
                        </span>
                        <span class="td3" :class="{blue:item.user_id==loginUser.user_id}">{{item.score}}字/分</span>
                    </li>
                </ul>
                <div class="notyperank" v-else>
                    <img src="../../assets/sametype.jpg">
                    <p>要用同种输入法测试才有排行哦！</p>
                </div>
            </div>
            <div class="myrank-list fl">
                <span class="bg">同</span>
                <label>同文本排名</label>
                <p class="overflow vm w90" :title="typingName">{{typingName}}</p>
                <ul>
                    <li v-for="(item,index) in rankList.article_rank">
                        <span class="td1"
                              :class="{top1:item.rank==1,top2:item.rank==2,top3:item.rank==3}">{{item.rank | filter1}}</span>
                        <span class="td2" :class="{blue:item.user_id==loginUser.user_id}">
                            <img :src="item.icon">&nbsp;{{item.display_name}}
                        </span>
                        <span class="td3" :class="{blue:item.user_id==loginUser.user_id}">{{item.score}}字/分</span>
                    </li>
                </ul>
            </div>
            <div class="myrank-list fr">
                <span class="bg">{{typingMode | filter4}}</span>
                <label>{{typingMode | filter3}}排名</label>
                <p>&nbsp;</p>
                <ul>
                    <li v-for="(item,index) in rankList.article_type_rank">
                        <span class="td1"
                              :class="{top1:item.rank==1,top2:item.rank==2,top3:item.rank==3}">{{item.rank | filter1}}</span>
                        <span class="td2" :class="{blue:item.user_id==loginUser.user_id}">
                            <img :src="item.icon">&nbsp;{{item.display_name}}
                        </span>
                        <span class="td3" :class="{blue:item.user_id==loginUser.user_id}">{{item.score}}字/分</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="myrank-c-f" v-else>
            <div v-if="typingArticle.is_default==1">
                <img src="../../assets/norank.jpg">
                <p>自定义文本不计入排名哦！</p>
            </div>
            <div v-else>
                <img src="../../assets/404.jpg">
                <p>网络走神了，请检查网络！</p>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default{
        name: 'rank',
        data(){
            return {
                loading: true
            };
        },
        methods: {
            ...mapActions(['rank_list']),
            ranks(id){
                this.rank_list(id).then(() => {
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        computed: {
            ...mapGetters(['rankList', 'currentTestdata', 'typingName', 'allStatisticData', 'typingArticle', 'loginUser', 'typingMode']),
        },
        filters: {
            filter1(index){
                return index > 3 ? index : '';
            },
            filter2(v){
                return v == '--' ? '' : v;
            },
            filter3(v){
                switch (v) {
                    case 0:
                        return '中文';
                    case 1:
                        return '英文';
                    case 2:
                        return '中英混合';
                }
            },
            filter4(v){
                switch (v) {
                    case 0:
                        return '中';
                    case 1:
                        return '英';
                    case 2:
                        return '混';
                }
            }
        },
        watch: {
            'currentTestdata': {
                handler(v){
                    if (v.id) {
                        this.ranks(v.id);
                    }
                },
                deep: true
            }
        },
        created(){
            if (this.currentTestdata.id) {
                this.ranks(this.currentTestdata.id);
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "./scss/rank";
</style>
