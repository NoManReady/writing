<template>
    <div class="myscore-content">
        <div class="myscore-content-l" v-if="mode==1">
            <div class="m-c-level">
                <p>本次打字水平级别：<a>{{csd.print_level}}</a></p>
                <a class="ll" href="javascript:;" @click="open(1)">查看级别规则</a>
                <div class="m-c-l-c" ref="ref_level" style="opacity: 0;">
                    <img :src="csd.print_level|filter1">
                </div>
            </div>
        </div>
        <div class="myscore-content-l" v-if="mode==2 && !loading">
            <div class="nolevel">
                <img src="../../assets/188.jpg">
            </div>
        </div>
        <div class="myscore-content-r">
            <div class="c-r-t">
                <p class="correct">
                    <span>正确字速度：</span><strong>{{asd.right_speed|parseInt}}</strong><span>字/分钟</span>
                </p>
                <p class="input">
                    <span>输入法：</span><span>{{asd.name}}</span>
                </p>
            </div>
            <div class="c-r-mid">
                <div class="time">
                    <label>时&emsp;&emsp;间：</label><span>{{asd.total_time | formatSecond}}</span>
                </div>
                <div class="count">
                    <label>总字数：</label><span>{{asd.word_count}}个</span>
                </div>
                <div class="speed">
                    <label>平均速度：</label><span>{{asd.avg_speed|parseInt}}字/分</span>
                </div>
                <div class="correct">
                    <label>正确率：</label><span>{{asd.accuracy|parseInt}}%</span>
                </div>
            </div>
            <div class="c-r-b">
                <p>
                    <span>查看精细的数据统计：</span>
                    <a @click="open(2)" href="javascript:;">查看</a>
                </p>
                <p>
                    <span>查看打字效率改善建议：</span>
                    <a @click="open(3)" href="javascript:;">查看</a>
                </p>
            </div>
        </div>
        <!-- 勋章提示动效 -->
        <transition @enter="enter" @after-enter="afterEnter">
            <div class="medal-content" ref="ref_container" v-if="csd.new_medals&&csd.new_medals.length>0">
                <div class="mark" ref="ref_mark"></div>

                <div class="medal-tip" ref="ref_a">
                    <img src="../../assets/congratulations.png" alt=""/>
                </div>
                <div class="medal" ref="ref_b">
                    <img src="../../assets/medal.png" alt=""/>
                </div>
            </div>
        </transition>
        <!-- /勋章提示动效 -->
        <Modal @nd-modal-close="modalClose" :visible="modalShow" :title="title" :spaceClose="true">
            <component :is="currentComponent" class="score-dialog"></component>
        </Modal>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Modal from '../tools/Modal';
    import level from './Level';
    import suggest from './Suggest';
    import detail from './Detail';
    import LEVEL from './js/enum';

    export default{
        name: 'score',
        data(){
            return {
                loading: true,
                title: '',
                mode: 0,  //1：有等级  2：无等级
                dialogType: 1,//1：级别 2：精细统计 3：改善建议
                modalShow: false
            };
        },
        methods: {
            open(t){
                this.modalShow = true;
                this.dialogType = t;
            },
            modalClose(){
                this.modalShow = false;
            },
            enter(el, done){
                this.$refs.ref_a.classList.add('zoomin');
                this.$refs.ref_b.classList.add('zoomin');

                setTimeout(() => {
                    done()
                }, 1000);
            },
            afterEnter(el){
                this.$refs.ref_mark.remove();
                this.$refs.ref_a.classList.remove('zoomin');
                this.$refs.ref_b.addEventListener('animationend', () => {
                    this.$refs.ref_container.remove();
                });
                this.$refs.ref_b.classList.add('bounceOutLeft');
            }
        },
        computed: {
            ...mapGetters({
                asd: 'allStatisticData',
                csd: 'currentTestdata'
            }),
            currentComponent(){
                switch (this.dialogType) {
                    case 1:
                        this.title = '级别规则';
                        return level;
                    case 2:
                        this.title = '精细数据';
                        return detail;
                    case 3:
                        this.title = '改善建议';
                        return suggest;
                }
            },
            mode(){
                return this.csd.print_level ? 1 : 2;
            }
        },
        components: {
            Modal
        },
        filters: {
            filter1(name){
                return name ? require('../../assets/stamp/' + LEVEL[name]) : '';
            }
        },
        watch: {
            csd: {
                handler(v){
                    this.loading = false;
                    if (v.print_level) {
                        setTimeout(() => {
                            this.$refs.ref_level.addEventListener('animationend', () => {
                                this.$refs.ref_level.classList.remove('bouncein');
                                this.$refs.ref_level.style.opacity = 1;
                            });
                            this.$refs.ref_level && this.$refs.ref_level.classList.add('bouncein');
                        }, v.new_medals.length > 0 ? 1000 : 0)
                    }
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "./scss/score";
</style>
