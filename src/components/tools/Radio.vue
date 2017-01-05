<template>
  <label class="nd-radio">
    <span class="nd-radio__input">
      <span class="nd-radio__inner"
        :class="{
        'is-disabled': disabled,
        'is-checked': model === labelValue
      }"></span>
      <input
        class="nd-radio__original"
        :value="labelValue"
        type="radio"
        v-model="model"
        :name="name"
        :disabled="disabled">
    </span>
    <span class="nd-radio__label">
      <slot></slot>
    </span>
  </label>
</template>
<script>
export default {
  name: 'NDRadio',
  props: {
      value: {},
      labelValue: {},
      disabled: {
          type: Boolean,
          default: false
      },
      name: {
          type: String
      }
  },
  props: ['value', 'labelValue', 'disabled', 'name'],
  computed: {
      model: {
          get() {
              return this.value;
          },
          set(val) {
              this.$emit('input', val);
          }
      }
  }
};
</script>
<style lang="scss" scoped>
$color_ghost_approx: #c0ccda;
$color_ebony_clay_approx: #1f2d3d;
$white: #fff;
$color_dodger_blue_approx: #38adff;
$color_geyser_approx: #d3dce6;
$color_porcelain_approx: #eff2f7;

%extend_1 {
    line-height: 1;
    vertical-align: middle;
    outline: 0;
}


.nd-radio-button__inner {
    @extend %extend_1;
    box-sizing: border-box;
    border: 1px solid $color_ghost_approx;
    display: inline-block;
    white-space: nowrap;
    position: relative;
    margin: 0;
    border-radius: 0;
    padding: 10px 15px;
    font-size: 14px;
    text-align: center;
    color: $color_ebony_clay_approx;
    background: $white;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    cursor: pointer;
    &:hover {
        color: $color_dodger_blue_approx;
    }
    [class*=nd-icon-] {
        line-height: .9;
        + span {
            margin-left: 5px;
        }
    }
}
.nd-radio__input {
    @extend %extend_1;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
}
.nd-radio {
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    color: $color_ebony_clay_approx;
}
.nd-radio__inner {
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid $color_ghost_approx;
    display: inline-block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background-color: $white;
    &.is-disabled {
        background-color: $color_porcelain_approx;
        cursor: not-allowed;
        border-color: $color_geyser_approx;
        &.is-checked {
            border-color: $color_geyser_approx;
            background-color: $color_geyser_approx;
        }
        &.is-checked::after {
            background-color: $white;
        }
        + .nd-radio__label {
            cursor: not-allowed;
        }
    }
    &.is-focus {
        border-color: $color_dodger_blue_approx;
    }
    &.is-checked {
        border-color: $color_dodger_blue_approx;
        background: $color_dodger_blue_approx;
    }
    &.is-disabled::after {
        background-color: $color_porcelain_approx;
        cursor: not-allowed;
    }
    &.is-checked::after {
        transform: translate(-50%,-50%) scale(1);
    }
    &:not(.is-disabled):hover {
        border-color: $color_dodger_blue_approx;
    }
}
.nd-radio__inner::after {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background-color: $white;
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6);
    transform: translate(-50%,-50%) scale(0);
    content: "";
}
.nd-radio__original {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: 0;
    outline: 0;
    opacity: 0;
}
.nd-radio__label {
    padding-left: 5px;
    font-size: 14px;
}
.nd-radio-group {
    display: inline-block;
    font-size: 0;
    line-height: 1;
    .nd-radio {
        font-size: 14px;
    }
}
.nd-radio-button {
    display: inline-block;
    overflow: hidden;
    position: relative;
    &:not(:last-child) {
        margin-right: -1px;
    }
    &:first-child .nd-radio-button__inner {
        border-radius: 4px 0 0 4px;
    }
    &:last-child .nd-radio-button__inner {
        border-radius: 0 4px 4px 0;
    }
}
.nd-radio-button__orig-radio {
    position: absolute;
    left: -999px;
    z-index: -1;
    outline: 0;
    opacity: 0;
    &:disabled + .nd-radio-button__inner {
        border-color: $color_geyser_approx;
        color: $color_ghost_approx;
        background-color: $color_porcelain_approx;
        background-image: none;
        cursor: not-allowed;
    }
}
.nd-radio-button--large .nd-radio-button__inner {
    border-radius: 0;
    padding: 11px 19px;
    font-size: 16px;
}
.nd-radio-button--small .nd-radio-button__inner {
    border-radius: 0;
    padding: 7px 9px;
    font-size: 12px;
}
.nd-radio-button--mini .nd-radio-button__inner {
    border-radius: 0;
    padding: 4px;
    font-size: 12px;
}
</style>
