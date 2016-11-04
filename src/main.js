import Vue from 'vue';

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import sync from 'vuex-router-sync';
import App from './App';
import router from './router';
import store from './store';
import filters from './filters';
import directives from './directives';
import plugins from './plugins';

Vue.use(VueResource);
Vue.use(plugins,{lifecircle:false});
for (let filter in filters) {
    Vue.filter(filter, filters[filter]);
}
for (let directive in directives) {
    Vue.directive(directive, directives[directive]);
}
/* eslint-disable no-new */
new Vue({
    store,
    router,
    ...App,
}).$mount('#app');
