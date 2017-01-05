<template>
    <div class="personal">
        <div class="e-panel-body">
            <div class="personal-container">
                <keep-alive>
                    <component :is="panel"></component>
                </keep-alive>
            </div>
        </div>
        <div class="e-panel-footer">
            <div class="e-tabs">
                <a href="javascript: void(0);" class="e-tab my-medal" :class="{active: type2 === 0}"
                   @click="switchTab(0)">
                    <span>我的勋章</span>
                </a>
                <a href="javascript: void(0);" class="e-tab my-line" :class="{active: type2 === 1}"
                   @click="switchTab(1)">
                    <span>进步曲线</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import Statis from './Statis';
    import Medal from './Medal';

    export default {
        name: 'personal',
        props: ['type'],
        data () {
            return {
                type2: ''
            };
        },
        computed: {
            panel(){
                return this.type2 == 0 ? Medal : Statis;
            }
        },
        methods: {
            switchTab (type) {
                this.type2 = type;
            }
        },
        created(){
            this.type2 = this.type;
        }
    };
</script>
<style lang="scss" scoped>
    @import './scss/personal';
</style>
