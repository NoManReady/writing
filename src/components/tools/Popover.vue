<template>
    <transition name="fade" appear>
        <div class="nd-popover" v-show="showPopper">
            <slot>reference</slot>
            <i class="arraw" :class="[position]"></i>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'Popover',
    props: {
        trigger: {
            default: 'click',
            type: String
        },
        position: {
            default: 'top',
            type: String
        }
    },
    data() {
        return {
            showPopper: false
        }
    },
    computed: {

    },
    mounted() {
        if (this.$refs.reference) {
            this.reference = this.referenceElm = this.$refs.reference;
        } else {
            return;
        }
        if (this.trigger === 'click') {
            this.reference.addEventListener('click', e => {
                this.showPopper = !this.showPopper;
            })
            document.addEventListener('click', this.documentClick);
        } else if (this.trigger === 'hover') {
            this.reference.addEventListener('mouseenter', this.handleMouseEnter);
            this.reference.addEventListener('mouseleave', this.handleMouseLeave);
        }
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    methods: {
        documentClick(e) {
            if (!this.$el ||
                !this.reference ||
                this.$el.contains(e.target) ||
                this.reference.contains(e.target)) return;
            this.showPopper = false;
        },
        handleMouseEnter(e) {
            this.showPopper = true;
        },
        handleMouseLeave(e) {
            this.showPopper = false;
        },
        handleResize(e){
            this.$el.style.left = this.reference.offsetLeft + 'px';
            this.$el.style.top = this.reference.offsetHeight + 'px';
        }
    },
    destroyed() {
        this.reference.removeEventListener('mouseenter', this.handleMouseEnter);
        this.reference.removeEventListener('mouseleave', this.handleMouseLeave);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.documentClick);
    }
}
</script>
<style lang="scss" scoped>
@import "../../scss/transition";
$backgroundColor: #fff;
$borderColor: #dfe1e5;
.nd-popover {
    position: absolute;
    z-index: 99;

    border: 1px solid $borderColor;
    border-radius: 2px;
    padding: 20px;
    left:-7px;

    background-color: $backgroundColor;
    .arraw {
        display: inline-block;

        position: absolute;

        width: 14px;
        height: 14px;
    }
    .arraw:before,
    .arraw:after {
        position: absolute;
        bottom: 0;
        left:0;
        margin: 0 auto;
        border-style: solid;
        border-color: transparent;

        content: "";
    }
    .arraw:before {
        z-index: 1;

        border-width: 6px;
    }
    .arraw:after {
        z-index: -1;

        border-width: 7px;
    }
    .arraw.top {
        top: 0;
        left: 80%;

        transform: translate(-50%,-100%);
    }
    .arraw.top:before {
        border-bottom-color: $backgroundColor;
    }
    .arraw.top:after {
        border-bottom-color: $borderColor;
    }
}
</style>
