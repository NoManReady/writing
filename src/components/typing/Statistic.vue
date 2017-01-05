<template>
  <div class="statistic-line">
    <label><span><i class="nd-icon nm-icon time mr10"></i>时间</span>{{time|formatSecond}}</label>
    <label><span><i class="nd-icon nm-icon speed mr10"></i>速度</span>{{speed|parseInt}} 字/分</label>
    <label><span><i class="nd-icon nm-icon progress mr10"></i>进度</span>{{progress|parseInt}}%</label>
    <label><span><i class="nd-icon nm-icon correct mr10"></i>正确率</span>{{correctRate|parseInt}}%</label>
    <template v-if="!finish">
        <a href="javascript:;" v-if="timer"><i class="nd-icon lg-icon stop" :class="{stop:!isPause,resume:isPause}" @click="runOrStop"></i></a>
    </template>
    <template v-else>
        <a href="javascript:;"><i class="nd-icon lg-icon refresh" @click="refresh"></i></a>
    </template>
  </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
export default {
    name: 'Statistic',
    props: ['time', 'speed', 'progress', 'correctRate', 'finish'],
    computed: {
        ...mapGetters(['isPause', 'timer', 'typingAid'])
    },
    methods: {
        ...mapActions(['pause_timer', 'resume_timer', 'reset_timeline']),
        // 暂停定时器
        stopTimer() {
            this.pause_timer();
        },
        // 恢复定时器
        resumeTimer() {
            this.resume_timer();
        },
        runOrStop() {
            if (this.isPause) {
                this.resumeTimer();
            } else {
                this.stopTimer();
            }
        },
        refresh() {
            this.$router.replace(`/articles`);
            this.$nextTick(() => {
                this.$router.replace(`/articles/${this.typingAid}`);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../scss/color';
  .statistic-line{
    font-size:14px;
    color:#5c6166;
    background:#f3f9fd;
    color:#a3a8ac;
    padding:0 30px;
    width:100%;
    height:100px;
    line-height:100px;
    border-top:1px solid #e3e8ec;
    position: absolute;
    bottom:0;
    left:0;
    label{
      margin-right:40px;
      i{
        font-size:28px;
      }
      span{
        margin-right:5px;
      }
    }
    .time{
        background-image:url(../../assets/icon/typing/time.png);
    }
    .speed{
        background-image:url(../../assets/icon/typing/speed.png);
    }
    .progress{
        background-image:url(../../assets/icon/typing/progress.png);
        width:36px;
    }
    .correct{
        background-image:url(../../assets/icon/typing/correct.png);
    }
    .stop,
    .resume,
    .refresh{
        color:$themeColor;
        position:absolute;
        right:20px;
        top:50%;
        transform:translate(-50%,-50%);
    }
    .stop{
        background-image:url(../../assets/icon/typing/stop.png);
    }
    .resume{
        background-image:url(../../assets/icon/typing/resume.png);
    }
    .refresh{
        background-image:url(../../assets/icon/typing/refresh.png);
    }
  }
</style>
