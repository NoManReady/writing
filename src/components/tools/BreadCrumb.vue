<template>
  <div class="typing-breadcrumb">
    <div class="crumb-item" v-for="(crumb,index) in breadcrumb">
        <template v-if="index!==breadcrumb.length-1">
            <a href="javascript:;" class="crumb-link" @click="linkTo(crumb.path)">{{crumb.name}}</a>
            <span class="separator">></span>
        </template>
        <template v-else>
            <span class="crumb-root">{{crumb.name}}</span>
        </template>
    </div>
  </div>
</template>
<script>
export default {
    props:['breadcrumb'],
    methods:{
        linkTo(path){
            this.$router.replace(path);
        }
    }
}
</script>
<style lang="scss" scoped>
$themeColor: #38adff;
.typing-breadcrumb {
    padding:15px 30px;
    background-color:#f3f9fd;
    .crumb-item {
        display: inline-block;
        .crumb-link {
            text-decoration: none;

            color: #5c5e66;
            &:hover {
                color: $themeColor;
            }
        }
        .crumb-root {
            color: #aeb0b8;
        }
        .separator {
            margin: 0 2px;
        }
    }
}

</style>
