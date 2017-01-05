import Vue from 'vue';

import VueResource from 'vue-resource';
import _ from 'lodash';

// UI框架
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'

import App from './App';
import router from './router';
import store from './store';
import filters from './filters';
import directives from './directives';
import plugins from './plugins';

import Message from './components/message/src/main';

Vue.prototype.$message = Message;

// Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(plugins, {
    lifecircle: false
});

for (let filter in filters) {
    Vue.filter(filter, filters[filter]);
}
for (let directive in directives) {
    Vue.directive(directive, directives[directive]);
}
let requests = [];
// Http拦截器
Vue.http.interceptors.push((request, next) => {
    // 请求前....
    if (!request.silent) {
        requests.push(request);
        store.dispatch('toggle_loading', true);
    }
    next(response => {
        // 请求后....
        if (!request.silent) {
            _.remove(requests, (r) => {
                return r === request;
            });
            if (requests.length === 0) {
                store.dispatch('toggle_loading', false);
            }
        }
        return response;
    })
});

// Router拦截器
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        store.dispatch('change_title', to.meta.title);
    }
    let crumb = {
        path: to.path,
        name: to.meta.level === 3 ? store.getters.typingName : (to.meta.level === 2 ? store.getters.modeName : '首页')
    };
    if (crumb.name) {
        store.dispatch('change_crumb', {
            index: to.meta.level - 1,
            route: crumb
        });
    }
    next();
});
/* eslint-disable no-new */
new Vue({
    store,
    router,
    ...App,
}).$mount('#app');
