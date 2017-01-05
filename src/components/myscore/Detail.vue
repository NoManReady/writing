<template>
    <div class="myscore-d">
        <div>
            <p>
                测试文章：<span class="dc overflow vm w80" :title="typingName">{{typingName}}</span>
            </p>
            <p class="mt">
                <label>输入法</label>：<span class="dc">{{asd.name}}</span>
            </p>
        </div>
        <div class="myscore-d-m">
            <ul>
                <li>
                    <label class="t">时间：</label><span>{{asd.total_time | formatSecond}}</span>
                </li>
                <li style="width: 35%">
                    <label class="cr">正确率：</label><span>{{asd.accuracy|parseInt}}%</span>
                </li>
                <li>
                    <label class="cw">正确字速度：</label><span>{{asd.right_speed|parseInt}}字/分</span>
                </li>
                <li>
                    <label class="ts">速度峰值：</label><span>{{asd.max_speed|parseInt}}字/分</span>
                </li>
                <li>
                    <label class="as">平均速度：</label><span>{{asd.avg_speed|parseInt}}字/分</span>
                </li>
            </ul>
        </div>
        <div class="myscore-d-b">
            <ul>
                <li>汉字数：<span>{{asd.word_count-asd.blank_count-asd.punctuation_count-asd.letter_count}}</span></li>
                <li>正确汉字数：<span>{{asd.right_word_count}}</span></li>
                <li>字母数：<span>{{asd.letter_count}}</span></li>
                <li>正确字母数：<span>{{asd.right_letter_count}}</span></li>
                <li>标点符号数：<span>{{asd.punctuation_count}}</span></li>
                <li>正确符号数：<span>{{asd.right_punctuation_count}}</span></li>
                <li>空格数：<span>{{asd.blank_count}}</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default{
        name: 'detail',
        data(){
            return {};
        },
        computed: {
            ...mapGetters({asd: 'allStatisticData','typingName':'typingName'}),
        }
    }
</script>
<style lang="scss" scoped>
    @import "./scss/detail";
</style>
