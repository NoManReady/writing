<template>
  <div class="typing-art">
    <div class="art-main">
        <div class="art-d" v-if="typingArticle">
            <h3 class="d-tit">{{typingArticle.title}}</h3>
            <p class="d-count">( 共{{typingArticle.word_count}}字 )</p>
            <p class="d-content" v-for="(content,index) in summary">{{content}}</p>
        </div>
        <div class="act-c">
            <div class="art-head">
                <div class="cata-container">
                    <ul class="cata-list">
                        <li class="cata-item" v-for="(catalog,index) in catalogs" :key="catalog.id">
                            <a class="c-item" href="javascript:;" :class="{active:catalog.id===typingCid}" @click="cataClick(catalog.id)">{{catalog.classify_name}}</a>
                        </li>
                    </ul>
                </div>
                <a href="javascript:;" class="nd-circle-btn art-btn" @click="customArticle">
                    <i class="icon-plus">+</i>
                    <span>自定义</span>
                </a>
            </div>
            <div class="art-list">
                <div class="art-block">
                    <div class="art-item" v-for="article in articles" :key="article.id">
                        <a class="a-item" :class="{active:article.id===typingAid}" href="javascript:;" @click="articleClick(article.id)">
                            <i class="a-flag sys" v-if="article.is_default===0">系</i>
                            <i class="a-flag user" v-else="article.is_default===1">自</i>
                            <span class="a-tit">{{article.title}}</span>
                        </a>
                        <i class="a-ope" v-if="article.is_default===1" @click="delArticle(article)"></i>
                    </div>
                    <div class="v-line line1"></div>
                    <div class="v-line line2"></div>
                    <!-- <div class="v-line line3"></div> -->
                </div>
                <div class="load-more" v-show="loadMore" @click="loadMoreFn">
                    <transition name="l-fade" mode="out-in">
                        <a href="javascript:;" class="load" v-if="!loading&&articles.length">加载更多</a>
                        <div class="ball-clip-rotate" v-else>
                            <div></div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
    <div class="art-tool clearfix">
        <div class="art-code">
            <label class="label-tit">编码提示：</label>
            <div class="radio-group vt">
                <radio :disabled="typingMode===1" :label-value="0" name="codeType" v-model="code">无</radio>
                <radio :disabled="typingMode===1" :label-value="3" name="codeType" v-model="code">拼音</radio>
                <radio :disabled="typingMode===1" :label-value="1" name="codeType" v-model="code">86版五笔</radio>
                <radio :disabled="typingMode===1" :label-value="2" name="codeType" v-model="code">98版五笔</radio>
                <!-- <label>
                    <input type="radio" :value="0" name="code" v-model="code" :disabled="typingMode===1"/>
                    <span class="r-tit">无</span>
                </label>
                <label>
                    <input type="radio" :value="3" name="code" v-model="code" :disabled="typingMode===1"/>
                    <span class="r-tit">拼音</span>
                </label>
                <label>
                    <input type="radio" :value="1" name="code" v-model="code" :disabled="typingMode===1"/>
                    <span class="r-tit">86版五笔</span>
                </label>
                <label>
                    <input type="radio" :value="2" name="code" v-model="code" :disabled="typingMode===1"/>
                    <span class="r-tit">98版五笔</span>
                </label> -->
            </div>
        </div>
        <div class="art-limit">
            <label>限时：</label>
            <div class="group">
                <div class="input-group vm">
                    <label>
                        <input :class="{error:!limitValid}" type="text" v-model="timeLimit" maxlength="3" />
                        <span>分钟</span>
                    </label>
                </div>
                <div class="btn-group vm">
                    <a href="javascript:;" class="btn-trans" @click="setLimit(1)" :class="{active:timeLimit==1}">1</a>
                    <a href="javascript:;" class="btn-trans" @click="setLimit(3)" :class="{active:timeLimit==3}">3</a>
                    <a href="javascript:;" class="btn-trans" @click="setLimit(5)" :class="{active:timeLimit==5}">5</a>
                    <a href="javascript:;" class="btn-trans" @click="setLimit(8)" :class="{active:timeLimit==8}">8</a>
                </div>
            </div>
            <p class="info-tip" >时间的有效范围数字格式【1-999】</p>
        </div>
        <div class="art-run">
            <a href="javascript:;" class="nd-circle-btn art-begin" :class="{disabled:!limitValid||!typingAid||!typingName}" @click="beginTest"  v-swing>开始测试</a>
            <p class="info-tip">如需获取输入法排行，请使用同种输入法完成测试</p>
        </div>
    </div>
    <Modal @nd-modal-close="modalClose" :visible="modalShow" :spaceClose="true" title="ND打字测试软件-文本编辑器">
        <Upload @nd-modal-close="modalClose"></Upload>
    </Modal>
    <div class="seperate-line"></div>
  </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import {
    setItem,
    getItem
} from '../../utils';
import Modal from '../tools/Modal';
import Radio from '../tools/Radio';
import Upload from './Upload';
export default {
    name: 'Articles',
    data() {
        return {
            // 偏移量
            page: 0,
            // 记录数
            size: 99999,
            // 限时是否有效
            limitValid: true,
            // 是否显示modal
            modalShow: false,
            // articles是否加载中
            loading: false
        }
    },
    components: {
        Modal,
        Upload,
        Radio
    },
    computed: {
        ...mapGetters(['typingMode', 'typingLimit', 'typingCode', 'typingAid', 'typingName', 'typingCid', 'typingArticle', 'catalogs', 'articles', 'articlesCount']),
        summary() {
            let content = this.typingArticle.breviary || '';
            if (content.length > 200) {
                content = content.slice(0, 200);
                content += '....';
            }
            let parray = content.split(/\n/g);
            return parray;
        },
        timeLimit: {
            get() {
                return this.typingLimit;
            },
            set(limit) {
                this.limitValid = (/^[0-9]+$/.test(limit) && limit <= 999 && limit >= 0) || limit === '';
                this.set_limit(limit||0);
            }
        },
        code: {
            get() {
                return this.typingMode !== 1 ? this.typingCode : 0;
            },
            set(code) {
                this.set_code(code);
            }
        },
        loadMore() {
            return this.articles.length < this.articlesCount;
        }
    },
    created() {
        this.reset_setting();
    },
    methods: {
        ...mapActions(['reset_setting', 'get_articles', 'get_catalogs', 'set_code', 'set_limit', 'set_articleid', 'set_catalogid', 'del_article', 'set_userConfigure', 'get_userConfigure']),
        queryArticles(append = false, silent = false) {
            return this.get_articles({
                query: {
                    page: this.page,
                    size: this.size
                },
                cid: this.typingCid,
                append,
                silent
            });
        },
        cataClick(cId) {
            this.set_catalogid(cId);
            this.page = 0;
            this.queryArticles().then(response=>{
                this.selectArticle();
            });
        },
        loadMoreFn() {
            this.page += 1;
            this.loading = true;
            setTimeout(() => {
                this.queryArticles(true, true).then(() => {
                    this.loading = false;
                });
            }, 300);
        },
        articleClick(aId) {
            this.set_articleid(aId);
        },
        setLimit(miunte) {
            this.timeLimit = miunte;
        },
        beginTest() {
            if (this.limitValid) {
                this.$router.replace(`/articles/${this.typingAid}`);
                this.set_userConfigure({
                    code_prompt_type: this.code,
                    limit_time: this.timeLimit
                });
                // 记录用户习惯
                setItem(`typingCid$$-${this.typingMode}`,this.typingCid);
                setItem(`typingAid$$-${this.typingCid}`, this.typingAid);
            }
        },
        customArticle() {
            this.modalShow = true;
        },
        modalClose() {
            this.modalShow = false;
        },
        delArticle(article) {
            this.del_article(article.id).then(() => {
                //this.$message.success('删除成功');
                // 清除用户习惯
                let typingAid = getItem(`typingAid$$-${this.typingCid}`);
                if(typingAid===article.id){
                    setItem(`typingAid$$-${this.typingCid}`, null);
                }
                // 随机选中文章
                if (this.typingAid === article.id) {
                    this.set_articleid(_.sample(this.articles.map(article => article.id)));
                }
            });
        },
        selectCatalog() {
            let typingCid = getItem(`typingCid$$-${this.typingMode}`);
            if (typingCid) {
                this.set_catalogid(typingCid);
            } else {
                this.set_catalogid(_.first(this.catalogs.map(catalog => catalog.id)));
            }
        },
        selectArticle() {
            let typingAid = getItem(`typingAid$$-${this.typingCid}`);
            if (typingAid) {
                this.set_articleid(typingAid);
            } else {
                this.set_articleid(_.sample(this.articles.map(article => article.id)));
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 如果有上一次记录则读取否则随机获取一个(catalog读取第一个)
            vm.get_catalogs(vm.typingMode).then((response) => {
                vm.selectCatalog();
                vm.queryArticles().then(response => {
                    vm.selectArticle();
                });
            });
            vm.get_userConfigure();
        })
    }
}
</script>
<style lang="scss">
@import "../../scss/mixins";
@import "../../scss/color";
$leftWidth: 720px;
$rightWidth: 280px;
$articleHeight: 430px;
.typing-art {
    color: #5c6166;
    position:relative;
    .seperate-line{
        position:absolute;
        right:$rightWidth;
        width:1px;
        height:calc(100% - 67px);
        top: -50px;
        background-color:#edeff4;
    }
    .art-main {
        @extend %clearfix;
        .act-c {
            margin-right: $rightWidth;
            .art-head,
            .art-list {
                width: $leftWidth;
            }
            .cata-container {
                display: inline-block;
                overflow: hidden;

                width: $leftWidth - 140px;

                vertical-align: middle;
            }
            .art-head {
                box-shadow: 0 -2px #edeff4 inset;
            }
            .art-btn {
                width: 100px;
                .icon-plus {
                    font-weight: bold;
                }
            }
            .cata-list {
                overflow: hidden;

                padding: 0 20px;
                height: 43px;

                @extend %clearfix;
                .cata-item {
                    float: left;

                    margin-right: 10px;
                    .c-item {
                        display: block;

                        padding: 10px 10px;

                        text-align: center;
                        &:hover,
                        &.active {
                            border-bottom: 2px solid $themeColor;
                        }
                    }
                }
            }
            .art-list {
                overflow: hidden;
                overflow-y: auto;

                height: $articleHeight;

                font-size: 0;
                .art-block {
                    position: relative;

                    @extend %clearfix;
                    .v-line {
                        position: absolute;
                        top: 0;

                        width: 1px;
                        height: 100%;
                        min-height: $articleHeight;

                        background-color: #edeff4;
                        &.line1 {
                            left: 33%;
                        }
                        &.line2 {
                            left: 66%;
                        }
                        &.line3 {
                            left: calc(100% - 1px);
                        }
                    }
                }
                .art-item {
                    float: left;

                    padding-left: 30px;
                    width: 33%;
                    &:nth-child(3n) {
                        width: 34%;
                    }
                    &:hover {
                        background-color: #eef1f6;
                    }
                    .a-item,
                    .a-flag,
                    .a-tit,
                    .a-ope {
                        display: inline-block;

                        vertical-align: middle;
                    }
                    .a-item {
                        padding: 15px 0;

                        font-size: 14px;
                        &.active {
                            color: $themeColor;
                        }
                    }
                    .a-tit {
                        margin-right: .5em;
                        margin-left: .5em;
                        width: 10em;

                        @extend %text-overflow;
                    }
                    .a-flag {
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;

                        font-size: 12px;
                        text-align: center;

                        color: #fff;
                        &.sys {
                            background-color: #49b3fe;
                        }
                        &.user {
                            background-color: #ff9518;
                        }
                    }
                    .a-ope {
                        width: 18px;
                        height: 18px;

                        background: url(../../assets/icon/typing/garbage.png);

                        cursor: pointer;
                        &:hover {
                            background: url(../../assets/icon/typing/garbagehover.png);
                        }
                    }
                }
                .load-more {
                    font-size: 14px;
                    text-align: center;
                    .load {
                        display: inline-block;

                        height: 23px;

                        color: lighten($themeColor,10%);
                        &:hover {
                            color: $themeColor;
                        }
                    }
                    .ball-clip-rotate {
                        height: 23px;
                        div {
                            display: inline-block;

                            margin: 2px;
                            border: 2px solid $themeColor;
                            border-bottom-color: transparent;
                            border-radius: 100%;
                            width: 10px;
                            width: 20px;
                            height: 10px;
                            height: 20px;

                            background: transparent !important;
                            background-color: $themeColor;

                            animation: rotate .75s 0s linear infinite;

                            animation-fill-mode: both;
                        }
                    }
                    @keyframes rotate {
                        0% {
                            transform: rotate(0deg) scale(1);
                        }
                        100% {
                            transform: rotate(360deg) scale(1);
                        }
                    }
                }
            }
        }
        .art-d {
            float: right;
            overflow: hidden;
            overflow-y: auto;

            padding: 0 20px;
            width: $rightWidth;
            height: 473px;
            .d-tit,
            .d-count {
                text-align: center;
            }
            .d-tit {
                margin-top: .5em;

                font-size: 14px;
            }
            .d-count {
                margin-bottom: .6em;

                font-size: 80%;

                color: #8a9199;
            }
            .d-content {
                line-height: 2;
                text-indent: 2em;
                word-break: break-all;
                white-space: pre-wrap;
            }
        }
    }
    .art-tool {
        position: relative;

        margin: 0 30px;
        height: 100px;

        color: #8a9199;
        &:before {
            display: block;

            position: absolute;

            border-top-left-radius: 1px;
            border-top-right-radius: 1px;
            width: 100%;
            height: 4px;

            background: linear-gradient(to top, #eaebed, #fff);

            content: "";
        }
        .art-code,
        .art-limit,
        .art-run {
            display: inline-block;

            padding: 20px 0;
            width: 33%;

            vertical-align: top;
            .label-tit {
                display: inline-block;

                width: 70px;

                text-align: right;
            }
        }
        .radio-group {
            width: 220px;

            font-size: 0;
            label {
                display: inline-block;

                margin-bottom: 10px;
                width: 50%;

                font-size: 14px;
                text-align: left;

                cursor: pointer;
            }
        }
        .group {
            margin-top: 10px;
        }
        .input-group {
            input {
                padding: 3px;
                width: 36px;

                text-align: center;
            }
        }
        .btn-group {
            .btn-trans {
                display: inline-block;

                margin-left: 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                width: 36px;
                height: 26px;

                line-height: 26px;
                text-align: center;

                color: #8a9199;
                &:hover {
                    border-color: $themeColor;

                    color: $themeColor;
                }
                &.active {
                    border-color: darken($themeColor,5%);

                    color: #fff;
                    background-color: $themeColor;
                }
            }
        }
        .art-run {
            text-align: center;
        }
        .art-begin {
            margin-bottom: 8px;
            width: 145px;
            height: 50px;

            font-size: 18px;
            line-height: 50px;
        }
    }
    .info-tip {
        margin-top: 5px;

        font-size: 90%;
        line-height: 2;
        text-align: center;

        color: #f43531;
    }
    .l-fade-enter {
        opacity: .1;

        transition: opacity .3s ease-in-out;
    }
    .l-fade-enter-active {
        opacity: 1;
    }
}
</style>
