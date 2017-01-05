<script src="../../../../auxo.static/auxo/admin/pay/js/stratery/settings.js"></script>
<template>
    <div class="mysuggest">
        <div>
            <div>
                <label class="t">错字</label>共<span>{{suggests.mis_prints.length}}</span>个
                <label v-if="suggests.mis_prints.length>0">
                    （这几个字输入准确，正确率就能达到100%啦！）
                </label>
                <label v-else>
                    （超赞，您的正确率已经登峰造极!）
                </label>
            </div>
            <div class="mysuggest-w">
                <div class="mysuggest-w-b" v-for="item in suggests.mis_prints">
                    <span class="l">{{item.word}}</span>
                    <span class="r pl10">
                    <span>编码：</span>
                    <span class="error">{{item.prompt | promptFilter}}</span>
                </span>
                </div>
            </div>
            <div class="mt">
                <label class="t">生字</label>共<span>{{suggests.slow_words.length}}</span>个
                <label v-if="suggests.slow_words.length>0">
                    （这几个字输入太慢啦，您可以进行针对性练习哦!）
                </label>
                <label v-else>
                    （厉害，您的输入速度简直不是吹的!）
                </label>
            </div>
            <div class="mysuggest-w">
                <div class="mysuggest-w-b" v-for="item in suggests.slow_words">
                    <span class="l">{{item.word}}</span>
                    <span class="r">
                    <span class="rl">编码：<label class="error overflow vm" style="width: 218px;" :title="item.prompt">{{item.prompt | promptFilter}}</label></span>
                    <span class="rr">耗时：<label class="error">{{item.elapsed_time | formatFloat}}</label>秒</span>
                </span>
                </div>
            </div>
        </div>
        <div class="no-data">

        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default{
        name: 'suggest',
        data(){
            return {};
        },
        methods: {
            ...mapActions(['suggestList'])
        },
        computed: {
            ...mapGetters(['currentTestdata', 'suggests']),
        },
        filters: {
            promptFilter(t){
                if (t == ';;') {
                    return '无';
                }

                return t ? t.split(';').join('; ') : '无';
            },
            formatFloat(v){
                if ((~~v / 1000 ) > 9999)
                    return '--';
                return ~~v / 1000;
            }
        },
        created(){
            this.suggestList(this.currentTestdata.id);
        }
    }

</script>
<style lang="scss" scoped>
    @import "./scss/suggest";
</style>
