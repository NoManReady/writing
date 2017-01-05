<template>
    <transition name="fade">
        <div class="loader" v-if="loading">
            <div class="loader-inner ball-spin-fade-loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
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

    background-color: rgba(#000,.05);
}
@keyframes ball-spin-fade-loader {
    50% {
        opacity: .3;

        transform: scale(.4);
    }
    100% {
        opacity: 1;

        transform: scale(1);
    }
}

.ball-spin-fade-loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    margin: auto;
    width: $ballSize;
    height: $ballSize;

    text-align: center;
}
.ball-spin-fade-loader > div:nth-child(1) {
    top: 25px;
    left: 0;

    animation: ball-spin-fade-loader 1s 0s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(2) {
    top: 17.04545px;
    left: 17.04545px;

    animation: ball-spin-fade-loader 1s .12s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(3) {
    top: 0;
    left: 25px;

    animation: ball-spin-fade-loader 1s .24s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(4) {
    top: -17.04545px;
    left: 17.04545px;

    animation: ball-spin-fade-loader 1s .36s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(5) {
    top: -25px;
    left: 0;

    animation: ball-spin-fade-loader 1s .48s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(6) {
    top: -17.04545px;
    left: -17.04545px;

    animation: ball-spin-fade-loader 1s .6s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(7) {
    top: 0;
    left: -25px;

    animation: ball-spin-fade-loader 1s .72s infinite linear;
}
.ball-spin-fade-loader > div:nth-child(8) {
    top: 17.04545px;
    left: -17.04545px;

    animation: ball-spin-fade-loader 1s .84s infinite linear;
}
.ball-spin-fade-loader > div {
    position: absolute;

    margin: 2px;
    border-radius: 100%;
    width: 15px;
    height: 15px;

    background-color: rgba(#38adff,.9);

    animation-fill-mode: both;
}
</style>
