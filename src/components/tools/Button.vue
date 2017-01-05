<template>
    <a href="javascript:;" v-text="label" @click="click" :class="['btn','btn-'+type]"></a>
</template>
<script>
export default {
    name: 'Button',
    props: {
        label: {
            type: String,
            default: '按钮'
        },
        click: {
            type: Function,
            default: () => {}
        },
        type: {
            type: String,
            default: 'default'
        }
    }
}
</script>
<style lang="scss" scoped>
$btnMap: (
        default:#eee #666,
        primary:#38adff #fff,
        error:#b00 #fff,
        disabled:#eee #666
        ) !default;
.btn {
    border-width: 1px;
    border-style: solid;
    border-color: #666;
    border-radius: 3px;
    padding: 8px 18px;
}
@each $key,$value in $btnMap {
    .btn-#{$key} {
        border-color: darken(nth($value,1),5%);

        color: nth($value,2);
        background-color: nth($value,1);
        &:hover {
            background-color: darken(nth($value,1),5%);

            box-shadow: inset 0 0 3px darken(nth($value,1),8%);
        }
        @if $key == disabled {
            cursor: default;
            pointer-events: none;
        }
    }
}
</style>
