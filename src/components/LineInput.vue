<template>
  <div class="lint-input">
    <p :style="firstLineStyle">{{content}}</p>
    <input class="placeholder" type="text" v-model="initval" :style="firstLineStyle" v-if="editable" v-focus="editable" ref="TLinput" @click="onClick($event)" @mouseup="onMouseup($event)">
    <p class="placeholder" :style="firstLineStyle" v-else>{{initval}}</p>
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
    SET_REMAIN_CONTENT
} from '../store/timeLine/constant';
import {
    getRealLength,
    getStringByLength
} from '../utils';
export default {
    name: 'LineInput',
    data() {
        return {
            initval: '',
            charsTime: [],
            currentPosition: 0,
            prevPosition: 0
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
        this.charsTime = _.fill(Array.from({
            length: this.lineSize
        }), 0);
    },
    computed: {
        ...mapGetters([`${PREFIX}timer`, `${PREFIX}line`]),
        firstLineStyle() {
            return this.isFirst && this.indent ? {
                'paddingLeft': '2em'
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
            if (!this.editable || !val) {

                return;
            }
            if (!this[`${PREFIX}timer`]) {
                this.begin_timer();
            }
            // 是否溢出
            let isOver = val.length >= this.lineSize;
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
            // 可用长度
            let charLenUse = isOver ? this.lineSize - oldVal.length : this.currentPosition - this.prevPosition;
            // 单字符时间
            let charTimePer = popSpan / (charsLength >= 1 ? charsLength : 1);
            // 输入开始位置
            let beginPosition = this.prevPosition;
            while (beginPosition < this.lineSize && beginPosition < this.currentPosition) {
                let prevValue = this.charsTime[beginPosition];
                this.$set(this.charsTime, beginPosition, prevValue + charTimePer);
                beginPosition++;
            }
            this.prevPosition = this.currentPosition;
            console.log(this.charsTime);

        }
    },
    methods: {
        ...mapActions(['begin_timer']),
        ...mapMutations([SET_LINE, SET_REMAIN_CONTENT]),
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
        onClick(evt) {
            this.prevPosition = this.getPosition(evt.target);
        },
        onMouseup(evt) {
            if (document.activeElement) {
              this.prevPosition=Math.min(document.activeElement.selectionStart,document.activeElement.selectionEnd);
            }
        }
    }
}


</script>
<style lang="scss" scoped>
  .lint-input{
    background: #fff;
    margin-bottom:1em;
    padding:5px;
    .placeholder{
      outline:none;
      border:none;
      width:100%;
      height:24px;
      line-height:24px;
    }
  }
</style>
