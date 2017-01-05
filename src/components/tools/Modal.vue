<template>
<div class="modal">
  <transition name="scale" appear>
      <div class="nd-modal" v-if="visible">
          <div class="nd-modal-header">
              <h3 class="nd-modal-title" v-text="title"></h3>
              <a href="javascript:;" class="close" @click="close">&times;</a>
          </div>
          <div class="nd-modal-body" :class="modalClass">
              <slot>
                  <p>nd-modal-body</p>
              </slot>
          </div>
      </div>
    </transition>
    <transition name="fade" appear>
      <shade @nd-mask-close="esc" v-if="visible"></shade>
    </transition>
</div>
</template>
<script>
import Btn from './Button';
import Shade from './Mask';
export default {
  name: 'Modal',
  components: {
      Btn,
      Shade
  },
  props: {
      title: {
          type: String,
          default: 'nd-modal-title'
      },
      spaceClose: {
          type: Boolean,
          default: false
      },
      visible: {
          type: Boolean,
          default: false
      },
      modalClass: {
          type: String,
          default: 'nd-modal-user'
      }
  },
  watch: {
      isShow: function(n) {
          if (n) {
              document.body.style.overflowY = 'hidden';
          } else {
              document.body.style.overflowY = 'auto';
          }
      }
  },
  methods: {
      close() {
          this.$emit('nd-modal-close');
      },
      esc() {
          if (this.spaceClose) {
              this.close();
          }
      }
  }
};
</script>
<style lang="scss" scoped>
@import "../../scss/mixins";
@import "../../scss/transition";
@import "../../scss/color";
$borderColor: #eee;
.nd-modal {
    overflow: hidden;

    position: fixed;
    top: 40%;
    left: 50%;
    z-index: 1001;

    margin: auto;
    border-radius: 3px;
    width: auto;
    min-width: 400px;

    color: #fff;
    background-color: #fff;

    box-shadow: 0 0 3px #eee;

    transform: translate(-50%,-50%) scale(1);
    transform-origin: center;
    .nd-modal-header {
        position: relative;

        padding: 6px 20px;

        background-color: #4fb5fd;
        .nd-modal-title {
            font-size: 14px;
        }
        .close {
            position: absolute;
            top: 0;
            right: 10px;

            font-size: 24px;

            color: #fff;
            &:hover {
                color: darken(#fff,5%);
            }
        }
    }
    .nd-modal-body {
        overflow: hidden;
        overflow-y: auto;

        padding: 10px 20px;
        min-height: 200px;
        max-height: 500px;
        &.nopadding {
            padding: 0;
        }
    }
}
</style>
