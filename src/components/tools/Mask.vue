<template>
    <div class="nd-mask" :style="maskStyle"  @click.self="notify" @keyup.esc="notify">
        <slot></slot>
    </div>
</template>
<style lang="scss">
.nd-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: #373737;
}
</style>
<script>
export default {
    name: 'Mask',
    props: {
        bgColor: {
            type: String,
            default: 'rgba(128,128,128,.3)'
        },
        zIndex: {
            type: Number,
            default: 1000
        },
        effect: {
            type: String,
            default: 'fade'
        },
        clickClose: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        maskStyle: function() {
            return {
                backgroundColor: this.bgColor,
                zIndex: this.zIndex
            }
        }
    },
    methods: {
        notify: function() {
            if (this.clickClose) {
                this.$emit('nd-mask-close');
            }
        }
    }
}
</script>
