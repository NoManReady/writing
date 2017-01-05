<template>
  <transition name="nd-message-fade">
    <div class="nd-message" v-show="visible" @mouseenter="clearTimer" @mouseleave="startTimer">
      <img class="nd-message__icon" :src="typeImg" alt="">
      <div class="nd-message__group">
        <p>{{ message }}</p>
        <div v-if="showClose" class="nd-message__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null
      };
    },

    computed: {
      typeImg() {
        return require(`../assets/${ this.type }.svg`);
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      }
    },

    mounted() {
      this.startTimer();
    }
  };
</script>
<style lang="scss" scoped>
    $white: #fff;
    $black_12: rgba(0,0,0,.12);
    $black_4: rgba(0,0,0,.04);
    $color_malachite_approx: #13ce66;
    $color_sunset_orange_approx: #ff4949;
    $color_picton_blue_approx: #50bfff;
    $color_saffron_approx: #f7ba2a;
    $color_regent_gray_approx: #8492a6;
    $color_ghost_approx: #c0ccda;
    $color_gull_gray_approx: #99a9bf;

    @charset "UTF-8";
    .nd-message {
        overflow: hidden;
        position: fixed;
        top: 20px;
        left: 50%;
        border-radius: 2px;
        padding: 10px 12px;
        min-width: 300px;
        background-color: $white;
        box-shadow: 0 2px 4px $black_12,0 0 6px $black_4;
        transition: opacity .3s,transform .4s;
        transform: translateX(-50%);
        .el-icon-circle-check {
            color: $color_malachite_approx;
        }
        .el-icon-circle-cross {
            color: $color_sunset_orange_approx;
        }
        .el-icon-information {
            color: $color_picton_blue_approx;
        }
        .el-icon-warning {
            color: $color_saffron_approx;
        }
    }
    .nd-message__group {
        position: relative;
        margin-left: 38px;
        p {
            margin: 0 34px 0 0;
            font-size: 14px;
            line-height: 20px;
            text-align: justify;
            white-space: nowrap;
            color: $color_regent_gray_approx;
        }
    }
    .nd-message__icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
    }
    .nd-message__closeBtn {
        position: absolute;
        top: 3px;
        right: 0;
        font-size: 14px;
        color: $color_ghost_approx;
        cursor: pointer;
        &:hover {
            color: $color_gull_gray_approx;
        }
    }
    .nd-message-fade-enter {
        opacity: 0;
        transform: translate(-50%,-100%);
    }
    .nd-message-fade-leave-active {
        opacity: 0;
        transform: translate(-50%,-100%);
    }
</style>
