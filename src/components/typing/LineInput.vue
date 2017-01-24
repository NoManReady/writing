<template>
  <div class="line-input">
    <p class="static-content" v-html="displayContent"></p>
    <input class="placeholder" type="text" v-model.delay="initval" v-if="editable" v-focus="editable" ref="TLinput" @click="onFocusClick($event)" onpaste="return false" @keydown="keydownOnce" />
    <p class="static-content" v-else>{{initval}}</p>
  </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import {
    encodeHtml
} from '../../utils';
export default {
    name: 'LineInput',
    data() {
        return {
            initval: '',
            prevPosition: 0,
            displayContent: ''
        }
    },
    props: {
        content: {
            type: String,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['currentLine', 'remainPrev', 'remainContent', 'prevCursorPosition', 'codeList','psize']),
        lineSize() {
            return this.content.length;
        },
        charsTime() {
            return _.fill(Array.from({
                length: this.lineSize
            }), 0);
        }
    },
    watch: {
        initval(val, oldVal) {
            if(this.cpLock){
                return;
            }
            this.$$begin_time=Date.now();
            let len = val.length;
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
            // 触发统计数据方法
            this.setStatisticsData();
            // 获取下一个输入文字编码
            this.setNextWordCode();
            // 判断错误（initval有变化就检测）
            this.judgeText(val);
            // 设置单字耗时
            this.set_charsTime({
                line: this.currentLine,
                data: this.charsTime
            });
        },
        editable() {
            this.initInputValue();
        }
    },
    methods: {
        ...mapActions(['begin_timer', 'set_line', 'set_remaincontent', 'set_remainprev', 'set_typingposition', 'set_totalposition', 'set_currentWordPosition', 'set_charsTime']),
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
        // 比较行字符串
        judgeText(val) {
            let corrects = [],
                errors = [],
                content = [];
            let len = Math.min(val.length, this.lineSize);
            for (let i = 0; i < len; i++) {
                let realContent = this.content.charAt(i);
                let wrapContent = encodeHtml(this.content.charAt(i));
                let charCode = this.codeList[this.prevCursorPosition + i].prompt;
                if (val.charAt(i) !== realContent) {
                    content.push(`<span style="color:red;">${wrapContent}</span>`);
                    errors.push({
                        p: i,
                        w: val.charAt(i),
                        rw: realContent,
                        c: charCode
                    });
                } else {
                    content.push(`<span style="color:#9E9E9E;">${wrapContent}</span>`);
                    corrects.push({
                        p: i,
                        w: val.charAt(i),
                        c: charCode
                    });
                }
            }
            if (len < this.lineSize) {
                content.push(encodeHtml(this.content.substr(len)));
            }
            this.displayContent = content.join('');
            // 设置错误、正确位置
            this.set_typingposition({
                line: this.currentLine,
                data: [errors, corrects]
            });
        },
        // 设置上一行剩余字符时间
        setPrevRemainTime(isOver) {
            // 判断是否是上一行溢出剩余值(是则初始化时间)
            let remain = this.remainPrev;
            if (remain) {
                for (let index = 0; index < Math.min(remain.len, this.lineSize); index++) {
                    this.$set(this.charsTime, index, remain.time);
                }
                if (isOver) {
                    this.set_remainprev(Object.assign({}, remain, {
                        len: remain.len - this.lineSize
                    }));
                } else {
                    this.set_remainprev(null);
                }
            }
        },
        // 设置内容超出策略
        setContentStrategy(isOver) {
            if (isOver) {
                // 剩余字符
                this.set_remaincontent(this.initval.substr(this.lineSize));
                // 等待下一轮更新数据（防止再次进入watch-initval）
                this.$nextTick(() => {
                    // 进入下一行编辑
                    setTimeout(()=>{
                        this.set_line(this.currentLine + 1);
                        this.set_totalposition(this.lineSize);
                        this.initval = this.initval.substr(0, this.lineSize);
                    },0);
                });
            } else {
                this.set_remaincontent(null);
            }
        },
        // 设置单字输入时间（如果溢出且具有有效输入字符则保存单字时间及字符数）
        setTimeAndPosition(isOver) {
            // input-DOM
            let TLinput = this.$refs.TLinput;
            if (!TLinput) {
                return;
            }
            // 当前光标位置
            let currentPosition = this.getPosition(TLinput);
            // 输入开始位置
            let beginPosition = this.prevPosition;
            // 输入字符长度
            let charsLength = currentPosition - beginPosition;
            // 超出字符数（当前输入字符即下一行有效时间字符数）
            let validCharLength = charsLength + beginPosition - this.lineSize;
            // 时间间隔
            let popSpan = this.$store.state.timeLine.timer.popSpan();
            popSpan=popSpan-Date.now()+this.$$begin_time;
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
                this.set_remainprev({
                    time: charTimePer,
                    len: validCharLength
                });
            }
            // 更新上一个光标位置
            this.prevPosition = currentPosition;
        },
        // 触发统计数据接口
        setStatisticsData() {
            if (this.t) {
                clearTimeout(this.t);
            }
            this.t = setTimeout(() => {
                this.$emit('setStatistics');
            }, 200);
        },
        // 设置下一个输入文字编码索引
        setNextWordCode() {
            this.set_currentWordPosition(this.prevPosition + this.prevCursorPosition);
        },
        // 初始化initval值
        initInputValue() {
            // 判断是否有剩余内容（有则初始化input默认值触发initval-watch）
            if (this.remainContent && this.editable) {
                this.initval = this.remainContent;
            }
        },
        // input点击获取焦点位置，更新prevPosition
        onFocusClick(evt) {
            this.prevPosition = this.getPosition(evt.target);
        },
        // 鼠标mouseup,如果input为焦点元素，是则更新prevPosition
        onMouseup(evt) {
            if (document.activeElement && document.activeElement === this.$refs.TLinput) {
                this.prevPosition = Math.min(document.activeElement.selectionStart, document.activeElement.selectionEnd);
            }
        },
        // 开启计时
        keydownOnce(e) {
            if (!this.$store.state.timeLine.timer) {
                this.begin_timer();
            }
            // 回车返回上一行事件触发
            if(e.keyCode===8&&this.initval===''){
                if(this.currentLine>0&&this.currentLine%this.psize!==0){
                    this.$emit('typingBack',this.currentLine - 1);
                    this.set_line(this.currentLine - 1);
                }
            }
            return true;
        },
        // input上锁
        inputLock(e){
            if(window.getIMEName().indexOf('微软')>-1){
                return;
            }
            this.cpLock = true;
        },
        // input解锁
        inputUnlock(){
            this.cpLock = false;
        }
    },
    created() {
        this.initInputValue();
        this.displayContent = encodeHtml(this.content);
    },
    mounted() {
        document.addEventListener('mouseup', this.onMouseup.bind(this), false);
        if(window.getIMEName&&typeof(window.getIMEName)==='function'){
            this.$el.addEventListener('compositionstart', this.inputLock,false);
            this.$el.addEventListener('compositionend', this.inputUnlock,false);
        }
    },
    beforeDestory() {
        document.removeEventListener('mouseup', this.onMouseup);
    }
}
</script>
<style lang="scss" scoped>
%lineHeight {
    height: 31px;

    line-height: 31px;
}
.line-input {
    margin-bottom: 7px;
    padding: 5px;
    padding: 8px 1.5em;

    color: #2e3033;
    background: #fff;
    .placeholder,
    .static-content {
        border: none;
        width: 100%;

        letter-spacing: 0;
        word-spacing: 0;
        overflow: hidden;
        word-break: break-all;
        outline: none;

        @extend %lineHeight;
    }
}
</style>
