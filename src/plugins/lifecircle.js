export default (vue, options) => {
    if (!options.lifecircle) {
        return;
    }
    const cb = options.lifecircle.cb || (() => {});
    vue.mixin({
        beforeCreate() {
            console.log(`${this.$options.name}--beforeCreate`);
        },
        created() {
            console.log(`${this.$options.name}--created`);
        },
        beforedMount() {
            console.log(`${this.$options.name}--beforedMount`);
        },
        mounted() {
            cb(this);
            console.log(`${this.$options.name}--mounted`);
        },
        beforeUpdate() {
            console.log(`${this.$options.name}--beforeUpdate`);
        },
        updated() {
            cb(this);
            console.log(`${this.$options.name}--updated`);
        },
        beforeDestory() {
            console.log(`${this.$options.name}--beforeDestory`);
        },
        destoryed() {
            console.log(`${this.$options.name}--destoryed`);
        },
    });
};
