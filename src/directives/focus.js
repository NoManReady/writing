// 自定义对象key值
const focusContext = '@@focus'; //获取焦点

function toggleFocus(el, focus) {
    if (focus) {
        el.focus();
    } else {
        el.blur();
    }
}
export default {
    bind(el, binding, vnode, oldvnode) {

        },
        inserted(el, binding, vnode) {
            toggleFocus(el, binding.value);
        },
        update(el, binding, vnode) {
            toggleFocus(el, binding.value);
        },
        componentUpdated() {},
        unbind(el) {

        }
}
