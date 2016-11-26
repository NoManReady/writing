<template>
  <div class="line-input">
    <p :style="firstLineStyle" v-html="displayContent"></p>
    <input class="placeholder" type="text" v-model="initval" :style="firstLineStyle" v-if="editable" v-focus="editable" ref="TLinput" @click="onClick($event)"/>
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
    SET_REMAIN_TIME
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
            currentPosition: 0,
            prevPosition: 0,
            isFirstInput: true,
            displayContent: '',
            errorsPosition: Object.freeze([])
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
        ...mapGetters([`${PREFIX}timer`, `${PREFIX}line`, `${PREFIX}remainTime`, `${PREFIX}remainContent`]),
        firstLineStyle() {
            return this.isFirst && this.indent ? {
                'textIndent': '2em'
            } : {};
        },
        lineRealSize() {
            return getRealLength(this.content);
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
            if (!this.editable || !len) {
                return;
            }
            if (!this[`${PREFIX}timer`]) {
                this.begin_timer();
            }
            // 是否溢出
            let isOver = len >= this.lineSize;
            // 判断是否是上一行溢出剩余值(是则初始化时间)
            let remain = this[`${PREFIX}remainTime`];
            if (remain && this.isFirstInput) {
                for (let index = 0; index < remain.len && index < this.lineSize; index++) {
                    this.$set(this.charsTime, index, remain.time);
                }
                if (len <= this.lineSize) {
                    this[SET_REMAIN_TIME](null);
                } else {
                    this[SET_REMAIN_TIME](Object.assign({}, remain, {
                        len: remain.len - this.lineSize
                    }));
                }
                this.isFirstInput = false;
            }
            // 如果溢出则将溢出字符保存
            if (isOver) {
                // 剩余字符
                this[SET_REMAIN_CONTENT](val.substr(this.lineSize));
                // 进入下一行编辑
                this[SET_LINE](this[`${PREFIX}line`] + 1);
                // 等待下一轮更新数据（防止再次进入watch-initval）
                this.$nextTick(() => {
                    this.initval = val.substr(0, this.lineSize);
                });
            }
            // 总时间
            let totalSpan = this[`${PREFIX}timer`].getTotalSpan();
            // 时间间隔
            let popSpan = this[`${PREFIX}timer`].popSpan();
            // input-DOM
            let TLinput = this.$refs.TLinput;
            if (!TLinput) {
                return;
            }
            // 光标位置
            this.currentPosition = this.getPosition(TLinput);
            // 输入字符长度
            let charsLength = this.currentPosition - this.prevPosition;
            // 超出字符数（当前输入字符即下一行有效时间字符数）
            let validCharLength = charsLength + this.prevPosition - this.lineSize;
            // 单字符时间
            let charTimePer = popSpan / (charsLength >= 1 ? charsLength : 1);
            // 输入开始位置
            let beginPosition = this.prevPosition;
            // 更新时间（当前位置小于总长度或者小于选区结束位置即输入字符数+开始位置）
            while (beginPosition < this.lineSize && beginPosition < this.currentPosition) {
                let prevValue = this.charsTime[beginPosition];
                this.$set(this.charsTime, beginPosition, prevValue + charTimePer);
                beginPosition++;
            }
            // 判断是否溢出且具有有效字符时间
            if (isOver && validCharLength > 0) {
                this[SET_REMAIN_TIME]({
                    time: charTimePer,
                    len: validCharLength
                });
            }
            // 更新上一个光标位置
            this.prevPosition = this.currentPosition;
            console.log(`this.charsTime:${this.charsTime}`);
        },
        editable(edit) {
            // 开启编辑时判断是否有剩余内容（有则初始值）
            if (this[`${PREFIX}remainContent`] && edit) {
                this.initval = this[`${PREFIX}remainContent`];
            }
        }
    },
    methods: {
        ...mapActions(['begin_timer']),
        ...mapMutations([SET_LINE, SET_REMAIN_CONTENT, SET_REMAIN_TIME]),
        // 获取元素光标位置
        getPosition(el) {
            let iCaretPos = 0;
            if (document.selection) {
                // Set focus on the element
                el.focus();
                // To get cursor position, get empty selection range
                let range = document.selection.createRange();
                // Move selection start to 0 position
                range.moveStart('character', -el.value.length);
                // The caret position is selection length
                iCaretPos = range.text.length;
            }
            // Firefox support
            else if (el.selectionStart || el.selectionStart == '0')
                iCaretPos = el.selectionStart;
            return iCaretPos;
        },
        // 比较行字符串
        judgeText(val) {
            let errors = [],
                content = [];
            let len = Math.min(val.length, this.lineSize);
            for (let i = 0; i < len; i++) {
                let realContent = this.content.charAt(i);
                if (val.charAt(i) !== realContent) {
                    errors.push(i);
                    content.push(`<span class="text-err">${realContent}</span>`);
                } else {
                    content.push(realContent);
                }
            }
            if (len < this.lineSize) {
                content.push(this.content.substr(len));
            }
            this.displayContent = content.join('');
            this.errorsPosition = errors;
        },
        onClick(evt) {
            this.prevPosition = this.getPosition(evt.target);
        },
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
