var echarts = require('echarts');

let Model = {
    data: {},
    index: 1,
    propertyKey: 'vue-echarts',
    getData (el) {
        let key = el.getAttribute(Model.propertyKey) || (el.setAttribute(Model.propertyKey, ++Model.index), Model.index);
        return Model.data[key] || (Model.data[key] = {});
    },
    setData (el, data) {
        let key = el.getAttribute(Model.propertyKey) || (el.setAttribute(Model.propertyKey, ++Model.index), Model.index);
        Model.data[key] = data;
    },
    removeData (el) {
        let key = el.getAttribute('vue-echarts');
        let data = Model.data[key];
        if (data && data.instance) {
            data.instance.dispose();
        }
        delete Model.data[key];
    },
    inserted (el, binding, vnode, oldVnode) {
        let data = {
            instance: echarts.init(el)
        };
        Model.setData(el, data);
        Model.update(el, binding, vnode, oldVnode);
    },
    update (el, binding, vnode, oldVnode) {
        let data = Model.getData(el);
        data.instance.clear();
        data.instance.setOption(binding.value || {});
    },
    unbind (el, binding, vnode, oldVnode) {
        Model.removeData(el);
    }
};

module.exports = Model;
