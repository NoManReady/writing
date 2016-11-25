<template>
  <div class="time-input">
    <label style="cursor:pointer;"><small>是否缩进：</small><input type="checkbox" v-model="indent"></label>
    <div v-for="(line,index) in lines">
      <line-input ref="lineInput" :isFirst="isFirstLine(line)" :content="line" :indent="indent" :index="index" :key="line"/>
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
    mapMutations
} from 'vuex';
import LineInput from './LineInput';
import {
  PREFIX,
    SET_LINE
} from '../store/timeLine/constant';
import {
    getRealLength,
    getStringByLength
} from '../utils';
import content from '../testData/content';
export default {
    name: 'TimeInput',
    data() {
        return {
            // 原文
            content: '',
            // 段落
            paragraph: [],
            // 行数
            lines: [],
            // 记录数据行
            logLines: [],
            // 每行字数
            lineSize: 20,
            // 段落缩进单字符数
            textIndent: 4,
            // 段落是否缩进
            indent: true,
            // 编辑行
            editLine: 0
        }
    },
    computed:{
      ...mapGetters([`${PREFIX}line`, `${PREFIX}remain`]),
    },
    components: {
        LineInput
    },
    watch: {
        indent() {
            this.lines = [];
            this.logLines = [];
            this[SET_LINE](0);
            this.generatorParagraphs();
        },
        [`${PREFIX}line`](v) {
            this.$refs.lineInput[v].initval=this[`${PREFIX}remain`];
        }
    },
    methods: {
        ...mapMutations([SET_LINE]),
        // 生成段落
        generatorParagraphs() {
            let Regexp = /<(\w+).*>(.*)<\/\1>/g;
            this.paragraph = this.content.match(Regexp).map((str) => {
                return str.replace(Regexp, '$2');
            });
            this.paragraph.forEach((content, i) => {
                this.generator(content, i);
            });
        },
        // 生成行
        generator(str, index) {
            let len = getRealLength(str);
            let lines = Math.ceil(len / this.lineSize);
            let linesPer = [];
            let content = str;
            let hasIndent = this.indent;
            while (lines > 0) {
                let size = this.lineSize,
                    sliceContent;
                if (hasIndent) {
                    hasIndent = false;
                    size -= this.textIndent;
                }
                sliceContent = getStringByLength(content, size);
                linesPer.push(sliceContent.content);
                lines--;
                content = content.substr(sliceContent.cursor);
            }
            this.logLines.push(linesPer);
            this.lines.push(...linesPer);
        },
        // 判断是否为首行
        isFirstLine(content) {
            for (let item of this.logLines) {
                if (content === item[0]) {
                    return true;
                    break;
                }
            }
            return false;
        }
    },
    mounted() {
        this.content = content;
        this.$nextTick(() => {
            this.generatorParagraphs();
        });
    }
}
</script>
<style lang="scss">
.time-input{
  min-height:100%;
  background-color:#ccc;
  padding:1em 2em;
}
</style>
