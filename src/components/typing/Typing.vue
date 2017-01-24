<template>
    <div class="typing-area">
        <div class="hint-zone" :class="{'hint-blank':!hasCodePrompt}">
            <template v-if="hasCodePrompt">
                <span class="hint-word">{{currentCodeTip.name}}</span>：<span
                    class="hint-tip">{{currentCodeTip.prompt}}</span>
            </template>
        </div>
        <div class="input-zone">
            <line-input v-for="(line,index) in inputAreaLines" ref="lineInput" :content="line" :key="line+index" :editable="isEditable(index)&&!finish"
                        @setStatistics="setStatistics" @typingBack="typingBack"/>
        </div>
        <statistic :time="totalTime" :correct-rate="correctRate" :speed="speed" :progress="progress" :finish="finish"/>
        <transition name="fade">
            <shade v-if="modalShow" @nd-mask-close="modalClose" :clickClose="false">
                <my-score @close="modalClose" class="p-center"/>
            </shade>
        </transition>
        <confirm :visible="confirmShow" @nd-confirm-close="confirmClose" :spaceClose="true">
            是否退出测试
        </confirm>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    import LineInput from './LineInput';
    import Statistic from './Statistic';
    import MyScore from '../myscore/Index';
    import Shade from '../tools/Mask';
    import Confirm from '../tools/Confirm';
    // import {
    //     getRealLength,
    //     getStringByLength
    // } from '../../utils';
    const signRegexp = /[\。\？\！\，\、\：\；\“\”\‘\’\（\）\《\》\.\?\!\,\/\:\;\"\'\(\)\<\>]/g;
    const blankRegexp = /\s/g;
    const numberRegxp=/[0-9]/g;
    const letterRegexp = /[a-zA-Z]/g;
    const wordRegexp = /[\u4e00-\u9fa5]/g;
    export default {
        name: 'TimeInput',
        data() {
            return {
                // // 首行记录
                // firstLinesFlag: [],
                // // 段落缩进单字符数
                // textIndent: 4,
                // // 段落是否缩进
                // indent: false,
                // 总时间
                totalTime: 0,
                // 进度
                progress: 0,
                // 正确率
                correctRate: 0,
                // 实时速度(平均速度)
                speed: 0,
                // 正确字速度
                rightSpeed: 0,
                //  峰值速度
                maxSpeed: 0,
                // 是否超时
                isTimeout: false,
                // 是否显示弹框
                modalShow: false,
                // 输入法抽取随机数
                randomPointer: [],
                // 输入法数组
                typingWritings: [],
                // 退出检测
                confirmShow: false
            }
        },
        computed: {
            ...mapGetters(['articleContent','lines', 'pindex', 'timer', 'psize', 'totalCorrect', 'totalError', 'totalCharsTime', 'isPause', 'typingAid', 'typingCode', 'codeList', 'currentWordPosition', 'prevCursorPosition', 'typingLimit']),
            inputAreaLines() {
                if(this.pindex==-1)
                    return [];

                const lines=this.lines.slice(this.pindex * this.psize, (this.pindex + 1) * this.psize);
                 while(lines.length<this.psize){
                     lines.push('');
                 }
                return lines;
            },
            contentString() {
                return this.articleContent.join('');
            },
            articleSize() {
                return this.contentString.length;
            },
            signCount() {
                return (this.contentString.match(signRegexp) || []).length;
            },
            blankCount() {
                return (this.contentString.match(blankRegexp) || []).length;
            },
            letterCount() {
                return (this.contentString.match(letterRegexp) || []).length;
            },
            currentCodeTip() {
                return this.codeList[this.currentWordPosition];
            },
            finish() {
                return (this.articleSize !== 0 && this.prevCursorPosition === this.articleSize) || this.isTimeout;
            },
            hasCodePrompt() {
                return this.typingCode !== 0 && this.currentCodeTip && this.currentCodeTip.prompt;
            }
        },
        components: {
            LineInput,
            Statistic,
            MyScore,
            Shade,
            Confirm
        },
        watch: {
            timer(v) {
                if (!v) {
                    return;
                }
                let times = null;
                if (this.typingLimit && this.typingLimit > 0) {
                    times = this.typingLimit * 60 * 1000 + 1000;
                }
                v.appendRepeateHandler('total', () => {
                    this.totalTime = v.getTotalSpan();
                    this.$nextTick(() => {
                        this.setTypeSpeed();
                        this.typingLimit && this.getTypeWriting(this.totalTime / (this.typingLimit * 60 * 1000) * 100);
                    });
                }, times || Number.MAX_VALUE, 1000);
                if (times) {
                    v.appendHandler('timeout', times, () => {
                        this.isTimeout = true;
                    });
                }
            },
            // pindex(index) {
            //     this.setPageTime();
            // },
            finish(v) {
                if (v) {
                    if(this.typingWritings.length<10){
                        this.getTypeWriting(100);
                    }
                    this.showResult();
                }
            },
            typingWritings(types) {
                if (this.finish && types.length === 10) {
                    this.showResult();
                }
            },
            progress(p) {
                if (!this.typingLimit) {
                    this.getTypeWriting(p);
                }
            }
        },
        methods: {
            ...mapActions(['set_line', 'set_time', 'init_content', 'init_codelist', 'create_typing', 'set_charsTime', 'set_alldata', 'post_data', 'reset_timeline','set_totalposition']),
            // 判断并获取输入法
            getTypeWriting(pointer) {
                while (this.randomPointer.length && pointer > this.randomPointer[0]) {
                    let pointer = this.randomPointer.splice(0, 1);
                    this.typingWritings.push(window.getIMEName ? (window.getIMEName() || false) : false);
                }
            },
            // // 生成段落
            // generatorLines() {
            //     this.articleContent.forEach((content, i) => {
            //         this.generator(content, i);
            //     });
            //     this.init_lines(this.lines);
            // },
            // // 生成行
            // generator(str, index) {
            //     let linesPer = [];
            //     let content = str;
            //     let hasIndent = this.indent;
            //     // 截取段落字符串，直到分配完
            //     while (content) {
            //         let size = this.lengthPerLine,
            //             slice;
            //         if (hasIndent) {
            //             hasIndent = false;
            //             size -= this.textIndent;
            //         }
            //         slice = getStringByLength(content, size);
            //         linesPer.push(slice.content);
            //         content = content.substr(slice.cursor);
            //     }
            //     this.firstLinesFlag.push(this.lines.length);
            //     this.lines.push(...linesPer);
            // },
            // // 判断是否为首行
            // isFirstLine(index) {
            //     return _.includes(this.firstLinesFlag, index);
            // },
            // 判断是否可编辑
            isEditable(index) {
                return index === this.$store.state.timeLine.currentLine % this.psize && !this.isPause;
            },
            // 设置统计数据(进度与正确率)
            setStatistics() {
                let currentLine = this.$store.state.timeLine.currentLine;
                let totalSize = this.getTypeWords();
                let totalCorrect = 0;
                for (let key in this.totalCorrect) {
                    totalCorrect += this.totalCorrect[key].length;
                }
                this.rightSpeed = this.totalTime ? totalCorrect / (this.totalTime / 1000 / 60) : 0;
                this.progress = Math.min(totalSize / this.articleSize * 100, 100);
                this.correctRate = Math.min(totalSize ? totalCorrect / totalSize * 100 : 0,100);
            },
            // 设置打字速度
            setTypeSpeed() {
                let totalSize = this.getTypeWords();
                this.speed = this.totalTime ? totalSize / (this.totalTime / 1000 / 60) : 0;
                this.maxSpeed = Math.max(this.speed, this.maxSpeed);
            },
            // 获取当前打字总数
            getTypeWords() {
                let currentLine = this.$store.state.timeLine.currentLine;
                let totalSize = 0;
                let nextInput = this.$refs.lineInput[this.$store.state.timeLine.currentLine % this.psize];

                if (currentLine >= 1) {
                    totalSize = this.lines.slice(0, currentLine).reduce((prev, next) => {
                        return prev + next.length;
                    }, totalSize);
                }
                if (nextInput) {
                    totalSize += nextInput.initval.length;
                }
                return totalSize || 0;
            },
            // // 设置一页输入总时长
            // setPageTime() {
            //     let lineInputs=this.$refs.lineInput;
            //     let total = lineInputs.reduce((prev, next) => {
            //         return prev + next.charsTime.reduce((p, n) => {
            //             return p + n;
            //         }, 0);
            //     }, 0);
            //     this.set_time(total);
            // },
            // 获取打字测试统计数据
            getTypingData() {
                let {
                    mis_prints,
                    slow_words,
                    right_letter_count,
                    right_punctuation_count,
                    right_word_count,
                    totalCount,
                    error_letter_count,
                    error_punctuation_count,
                    error_word_count,
                    blank_count,
                    error_number_count,
                    right_number_count
                } = this.getWordStatisticData();
                const hashCode = (str) => {
                    let hash = 0;
                    if (str.length == 0) return hash;
                    for (let i = 0, len = str.length; i < len; i++) {
                        let char = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    return hash;
                }
                const writeHash = _.groupBy(this.typingWritings, write => {
                    return hashCode(write);
                });
                let typeWrite = '--';
                for (let hashCode in writeHash) {
                    if (writeHash[hashCode] && writeHash[hashCode][0] && writeHash[hashCode].length >= 7) {
                        typeWrite = writeHash[hashCode][0];
                    }
                }
                let data = {
                    article_id: this.typingAid,
                    name: typeWrite,
                    code_prompt_type: this.typingCode,
                    limit_time: this.typingLimit,
                    total_time: this.totalTime,
                    right_speed: this.rightSpeed,
                    max_speed: this.maxSpeed,
                    avg_speed: this.speed,
                    accuracy: this.correctRate,
                    word_count: totalCount,//总数
                    total_word_count:error_word_count+right_word_count,//总汉子数
                    right_word_count: right_word_count,//正确汉子数
                    letter_count: right_letter_count + error_letter_count,//总字母数
                    right_letter_count: right_letter_count,//正确字母数
                    punctuation_count: right_punctuation_count + error_punctuation_count,//总标点符号数
                    right_punctuation_count: right_punctuation_count,//正确标点符号数
                    blank_count: blank_count,
                    right_number_count:right_number_count,
                    number_count:error_number_count+right_number_count,
                    typo_words_batch_vo_for_create: {
                        mis_prints,
                        slow_words
                    }
                };
                return data;
            },
            // 获取用户输入各种类型统计个数
            getWordStatisticData() {
                const totalError = this.totalError;
                const totalCorrect = this.totalCorrect;
                const totalCharsTime = this.totalCharsTime;
                const codeList = this.codeList;
                const mis_prints = [];
                const slow_words = [];

                let totalCount = 0;
                let error_letter_count = 0;
                let right_letter_count = 0;
                let error_word_count = 0;
                let right_word_count = 0;
                let error_punctuation_count=0;
                let right_punctuation_count = 0;
                let right_number_count=0;
                let error_number_count=0;
                let blank_count=0;
                for (let line in totalError) {
                    let errorLine = totalError[line];
                    let correctLine = totalCorrect[line];
                    let lineCharsTime = totalCharsTime[line];
                    totalCount+=errorLine.length+correctLine.length;
                    let errorWordFlat='';
                    errorLine.forEach((errorItem) => {
                        if (_.findIndex(mis_prints, {
                                word: errorItem.rw
                            }) === -1) {
                            mis_prints.push({
                                word: errorItem.rw,
                                elapsed_time: lineCharsTime[errorItem.p],
                                prompt: errorItem.c
                            });
                        }
                        errorWordFlat+=errorItem.w;
                    });
                    let correctWordFlat = '';
                    correctLine.forEach((correctItem) => {
                        let correctTime = lineCharsTime[correctItem.p];
                        if (correctTime > 3000) {
                            let index = _.findIndex(slow_words, {
                                word: correctItem.w
                            });
                            let pushData = {
                                word: correctItem.w,
                                elapsed_time: correctTime,
                                prompt: correctItem.c
                            };
                            if (index === -1) {
                                slow_words.push(pushData);
                            } else {
                                let result = _.result(_.find(slow_words, {
                                    word: correctItem.w
                                }), 'elapsed_time');
                                if (result < correctTime) {
                                    slow_words.splice(index, 1, pushData);
                                }
                            }
                        }
                        correctWordFlat += correctItem.w;
                    });
                    error_letter_count += (errorWordFlat.match(letterRegexp) || []).length;
                    right_letter_count += (correctWordFlat.match(letterRegexp) || []).length;
                    error_punctuation_count += (errorWordFlat.match(signRegexp) || []).length;
                    right_punctuation_count += (correctWordFlat.match(signRegexp) || []).length;
                    error_word_count += (errorWordFlat.match(wordRegexp) || []).length;
                    right_word_count += (correctWordFlat.match(wordRegexp) || []).length;
                    error_number_count+=(errorWordFlat.match(numberRegxp)||[]).length;
                    right_number_count+=(correctWordFlat.match(numberRegxp)||[]).length;
                    blank_count += (errorWordFlat.match(blankRegexp) || []).length;
                    blank_count += (correctWordFlat.match(blankRegexp) || []).length;
                }
                return ({
                    mis_prints,
                    slow_words,
                    right_letter_count,
                    right_punctuation_count,
                    right_word_count,
                    totalCount,
                    error_letter_count,
                    error_punctuation_count,
                    error_word_count,
                    blank_count,
                    error_number_count,
                    right_number_count
                });
            },
            // 关闭我的成绩弹框
            modalClose() {
                this.modalShow = false;
            },
            // 随机生成十个点
            generateRandomPinters(length = 10) {
                const randomPointer = Array.from({
                    length: length
                }).map(p => {
                    return ~~(Math.random() * 100);
                }).sort((i, j) => {
                    return i > j;
                });
                return randomPointer;
            },
            // 显示结果
            showResult() {
                if(this.posting){
                    return;
                }else{
                    this.posting=true;
                }
                this.timer.removeHandler('total');
                if (this.totalTime < 1000) {
                    this.totalTime = 1000;
                }
                this.$nextTick(() => {
                    this.setStatistics();
                    this.setTypeSpeed();
                    let typingData = this.getTypingData();
                    this.post_data(typingData);
                    this.modalShow = true;
                });
            },
            // 提示框关闭
            confirmClose(type) {
                if (type === 1) {
                    this.$router.replace(this.fullPath);
                }
                this.$nextTick(() => {
                    this.confirmShow = false;
                });
            },
            // 打字回滚（设置已完成输入字符数）
            typingBack(line){
                this.set_totalposition(-this.lines[line].length);
            }
        },
        beforeRouteLeave(to, from, next) {
            if (this && !this.confirmShow && !this.finish) {
                this.confirmShow = true;
                this.fullPath = to.fullPath;
            } else {
                next();
            }
        },
        created() {
            this.reset_timeline();
            this.init_content(this.typingAid);
            this.init_codelist({
                aid: this.typingAid,
                code: this.typingCode
            });
            this.randomPointer = this.generateRandomPinters(10);
        },
        mounted() {
            document.oncontextmenu = e => {
                e.returnValue = false;
            };
            document.onselectstart = e => {
                e.returnValue = false;
            };
        },
        beforeDestory() {
            document.oncontextmenu = null;
            document.onselectstart = null;
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../scss/transition";
    .typing-area {
        padding: 8px 0;

        font-size: 18px;

        // background-color: #f3f9fd;
        .hint-zone,
        .input-zone {
            margin: 0 30px;
        }
        .hint-zone {
            margin-bottom: 8px;
            padding-left: 1.5em;
            height: 50px;

            line-height: 50px;

            color: #ff9518;
            background-color: #fff;
            &.hint-blank {
                background-color: transparent;
            }
        }
        .p-center {
            position: absolute;
            top: 50%;
            left: 50%;

            font-size: 14px;

            transform: translate(-50%, -50%);
        }
    }
</style>
