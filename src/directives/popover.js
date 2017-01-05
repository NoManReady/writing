// 自定义对象key值
const popoverContext = '@@popover'; //popover上下文

export default {
    bind(el, binding, vnode, oldvnode) {
        vnode.context.$refs[binding.arg].$refs.reference = el;
    }
}
