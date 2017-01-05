<template>
   <div class="confirm">
      <transition name="scale" appear>
          <div class="nd-confirm" v-if="visible">
              <div class="nd-confirm-body" :class="confirmClass">
                  <i class="warn"></i>
                  <p class="text">
                      <slot></slot>
                  </p>
              </div>
              <div class="nd-confirm-footer">
                  <div class="btn-group">
                      <a href="javascript:;" class="btn-item" @click="close(1)">是</a>
                      <a href="javascript:;" class="btn-item primary" @click="close(0)">否</a>
                  </div>
              </div>
          </div>
        </transition>
        <transition name="fade" appear>
          <shade @nd-mask-close="esc" v-if="visible"></shade>
        </transition>
    </div>
</template>
<script>
import Shade from './Mask';
import Btn from './Button';
export default {
    data() {
            return {

            }
        },
        components: {
            Shade,
            Btn
        },
        props: {
            spaceClose: {
                type: Boolean,
                default: false
            },
            visible: {
                type: Boolean,
                default: false
            },
            confirmClass: {
                type: String,
                default: 'nd-confirm-user'
            }
        },
        watch: {
            visible: function(n) {
                if (n) {
                    document.body.style.overflowY = 'hidden';
                } else {
                    document.body.style.overflowY = 'auto';
                }
            }
        },
        methods: {
            close(type) {
                this.$emit('nd-confirm-close', type);
            },
            esc() {
                if (this.spaceClose) {
                    this.close(0);
                }
            }
        }
}
</script>
<style lang="scss" scoped>
@import "../../scss/transition";
@import "../../scss/color";
$borderColor: #eee;
.nd-confirm {
    overflow: hidden;

    position: fixed;
    top: 40%;
    left: 50%;
    z-index: 1100;

    margin: auto;
    border-radius: 6px;
    width: auto;
    min-width: 400px;

    color: #fff;
    background-color: #fff;

    box-shadow: 0 0 3px #eee;

    transform: translate(-50%,-50%) scale(1);
    transform-origin: center;
    .nd-confirm-body {
        overflow: hidden;
        overflow-y: auto;

        padding: 10px 20px;
        min-height: 100px;
        max-height: 500px;
        .text {
            margin: 20px 0;

            font-size: 16px;
            text-align: center;

            color: darken(#b4b5b7,10%);
        }
        .warn {
            display: block;

            margin: 0 auto;
            width: 76px;
            height: 76px;

            background: url(../../assets/icon/typing/warn.png) no-repeat;
        }
    }
    .nd-confirm-footer {
        .btn-group {
            font-size: 0;
            .btn-item {
                display: inline-block;

                width: 50%;
                height: 60px;

                font-size: 18px;
                line-height: 60px;
                text-align: center;
                vertical-align: middle;

                color: #969b9f;
                background-color: #eef1f6;
                &:hover {
                    background-color: darken(#eef1f6,5%);
                }
                &.primary {
                    color: #fff;
                    background-color: $themeColor;
                    &:hover {
                        background-color: darken($themeColor,5%);
                    }
                }
            }
        }
    }
}

</style>
