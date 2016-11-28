<template>
  <div class="line-input">
    <p :style="firstLineStyle" v-html="displayContent"></p>
    <input class="placeholder" type="text" v-model="initval" :style="firstLineStyle" v-if="editable" v-focus="editable" ref="TLinput" @click="onFocusClick($event)"/>
    <p :style="firstLineStyle" v-else>{{initval}}</p>
  </div>
</template>
<script>
import _ from 'lodash';
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex';
import {
    PREFIX,
    SET_LINE,
    SET_REMAIN_CONTENT,
    SET_REMAIN_PREV
} from '../store/timeLine/constant';
import {
    getRealLength
} from '../utils';
export default {
    name: 'LineInput',
    data() {
        return {
            initval: '',
            charsTime: [],
            prevPosition: 0,
            displayContent: '',
            errorsPosition: Object.freeze([]),
            correctsPosition: Object.freeze([])
        }
    },
    props: {
        content: {
            type: String,
            required: true
        },
        isFirst: {
            type: Boolean,
            default: false
        },
        indent: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.displayContent = this.content;
        this.charsTime = _.fill(Array.from({
            length: this.lineSize
        }), 0);
    },
    computed: {
        ...mapGetters([`${PREFIX}line`, `${PREFIX}remainPrev`, `${PREFIX}remainContent`]),
        firstLineStyle() {
            return this.isFirst && this.indent ? {
                'textIndent': '2em'
            } : {};
        },
        lineSize() {
            return this.content.length;
        },
        editable() {
            return this[`${PREFIX}line`] === this.index;
        }
    },
    watch: {
        initval(val, oldVal) {
            let len = val.length;
            // 判断错误（initval有变化就检测）
            this.judgeText(val);
            // 防止二次进入
            if (!this.editable) {
                return;
            }
            // 判断是否初始化timer（无则初始化timer）
            if (!this.$store.state.timeLine.timer) {
                this.begin_timer();
            }
            // 内容是否溢出
            let isOver = len >= this.lineSize;
            // 设置上一轮剩余时间
            this.setPrevRemainTime(isOver);
            // 设置溢出字符策略并进入下一行编辑
            this.setContentStrategy(isOver);
            // 设置单字输入时间
            this.setTimeAndPosition(isOver);
        },
        editable(edit) {
            // 开启编辑时判断是否有剩余内容（有则初始化input默认值触发initval-watch）
            if (this[`${PREFIX}remainContent`] && edit) {
                this.initval = this[`${PREFIX}remainContent`];
            }
        }
    },
    methods: {
        ...mapActions(['begin_timer']),
        ...mapMutations([SET_LINE, SET_REMAIN_CONTENT, SET_REMAIN_PREV]),
        // 获取元素光标位置
        getPosition(el) {
            let cursorPosition = 0;
            if (document.selection) {
                el.focus();
                let range = document.selection.createRange();
                range.moveStart('character', -el.value.length);
                cursorPosition = range.text.length;
            } else if (el.selectionStart || el.selectionStart == '0')
                cursorPosition = el.selectionStart;
            return cursorPosition;
        },
        // 设置内容超出策略
        setContentStrategy(isOver) {
            if (isOver) {
                // 剩余字符
                this[SET_REMAIN_CONTENT](this.initval.substr(this.lineSize));
                // 进入下一行编辑
                this[SET_LINE](this[`${PREFIX}line`] + 1);
                // 等待下一轮更新数据（防止再次进入watch-initval）
                this.$nextTick(() => {
                    this.initval = this.initval.substr(0, this.lineSize);
                });
            } else {
                this[SET_REMAIN_CONTENT](null);
            }
        },
        // 设置上一行剩余字符时间
        setPrevRemainTime(isOver) {
            // 判断是否是上一行溢出剩余值(是则初始化时间)
            let remain = this[`${PREFIX}remainPrev`];
            if (remain) {
                for (let index = 0; index < Math.min(remain.len, this.lineSize); index++) {
                    this.$set(this.charsTime, index, remain.time);
                }
                if (isOver) {
                    this[SET_REMAIN_PREV](Object.assign({}, remain, {
                        len: remain.len - this.lineSize
                    }));
                } else {
                    this[SET_REMAIN_PREV](null);
                }
            }
        },
        // 设置单字输入时间（如果溢出且具有有效输入字符则保存单字时间及字符数）
        setTimeAndPosition() {
            // input-DOM
            let TLinput = this.$refs.TLinput;
            if (!TLinput) {
                return;
            }
            // 时间间隔
            let popSpan = this.$store.state.timeLine.timer.popSpan();
            // 当前光标位置
            let currentPosition = this.getPosition(TLinput);
            // 输入开始位置
            let beginPosition = this.prevPosition;
            // 输入字符长度
            let charsLength = currentPosition - beginPosition;
            // 超出字符数（当前输入字符即下一行有效时间字符数）
            let validCharLength = charsLength + beginPosition - this.lineSize;
            // 单字符时间
            let charTimePer = popSpan / (charsLength >= 1 ? charsLength : 1);
            // 更新时间（当前位置小于总长度或者小于选区结束位置即输入字符数+开始位置）
            while (beginPosition < this.lineSize && beginPosition < currentPosition) {
                let prevValue = this.charsTime[beginPosition];
                this.$set(this.charsTime, beginPosition, prevValue + charTimePer);
                beginPosition++;
            }
            // 判断是否溢出且具有有效字符时间
            if (validCharLength > 0) {
                this[SET_REMAIN_PREV]({
                    time: charTimePer,
                    len: validCharLength
                });
            }
            // 更新上一个光标位置
            this.prevPosition = currentPosition;
        },
        // 比较行字符串
        judgeText(val) {
            let corrects = [],
                errors = [],
                content = [];
            let len = Math.min(val.length, this.lineSize);
            for (let i = 0; i < len; i++) {
                let realContent = this.content.charAt(i);
                if (val.charAt(i) !== realContent) {
                    errors.push(i);
                    content.push(`<span class="text-err">${realContent}</span>`);
                } else {
                    content.push(realContent);
                    corrects.push(i);
                }
            }
            if (len < this.lineSize) {
                content.push(this.content.substr(len));
            }
            this.displayContent = content.join('');
            this.errorsPosition = Object.freeze(errors);
            this.correctsPosition = Object.freeze(corrects);
        },
        // input点击获取焦点位置，更新prevPosition
        onFocusClick(evt) {
            this.prevPosition = this.getPosition(evt.target);
        },
        // 鼠标mouseup,如果input为焦点元素，是则更新prevPosition
        onMouseup(evt) {
            if (document.activeElement && document.activeElement === this.$refs.TLinput) {
                this.prevPosition = Math.min(document.activeElement.selectionStart, document.activeElement.selectionEnd);
                console.log(`this.prevPosition:${this.prevPosition}`);
            }
        }
    },
    mounted() {
        document.addEventListener('mouseup', this.onMouseup.bind(this), false);
    },
    beforeDestory() {
        document.removeEventListener('mouseup', this.onMouseup);
    }
}
</script>
<style lang="scss">
  .line-input{
    background: #fff;
    margin-bottom:1em;
    padding:5px;
    p{
        height:24px;
        line-height: 24px;
    }
    .placeholder{
      outline:none;
      border:none;
      width:100%;
      resize: none;
    }
    .text-err{
        color:red;
    }
  }
</style>
