import Vue from 'vue';
import VueRouter from 'vue-router';
import List from '../components/List';
import Upload from '../components/Upload';
const routes = [{
    path: '/home',
    component: List,
    name:'List'
}, {
    path: '/upload',
    component: Upload,
    name:'Upload'
}, {
    path: '*',
    redirect: '/home'
}];

Vue.use(VueRouter);
export default new VueRouter({
    mode: 'hash',
    scrollBehavior: () => ({
        x: 0,
        y: 0
    }),
    routes,
});
