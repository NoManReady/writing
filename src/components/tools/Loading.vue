<template>
    <transition name="fade">
        <div class="loader" v-if="loading">
            <div class="loader-inner ball-scale-multiple">
              <div class="loader-ball"></div>
              <div class="loader-ball"></div>
              <div class="loader-ball"></div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: ['loading']
}
</script>
<style lang="scss" scoped>
@import "../../scss/transition";
$ballSize: 90px;
.loader {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(#000,.1);
}
.ball-scale-multiple {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    margin: auto;
    width: $ballSize;
    height: $ballSize;

    text-align: center;
    .loader-ball {
        position: absolute;
        top: 0;
        left: 0;

        border-radius: 100%;
        width: $ballSize;
        height: $ballSize;

        background-color: rgba(#38adff,.5);

        animation: ball-scale-multiple 1s 0s linear infinite;

        animation-fill-mode: both;
    }
    .loader-ball:nth-child(2) {
        animation-delay: .2s;
    }
    .loader-ball:nth-child(3) {
        animation-delay: .4s;
    }
}
@keyframes ball-scale-multiple {
    0% {
        opacity: 0;

        transform: scale(0);
    }

    5% {
        opacity: 1;
    }

    100% {
        opacity: 0;

        transform: scale(1);
    }
}
</style>
