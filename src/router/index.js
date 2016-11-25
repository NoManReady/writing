import Vue from 'vue';
import VueRouter from 'vue-router';
import List from '../components/List';
import Canvas from '../components/Canvas';
import Upload from '../components/Upload';
import TimeInput from '../components/TimeInput';
import EchatLine from '../components/EchatLine';
const routes = [{
    path: '/home',
    component: List,
    name:'List'
}, {
    path: '/upload',
    component: Upload,
    name:'Upload'
},{
    path: '/canvas',
    component: Canvas,
    name:'Canvas'
},{
    path: '/timeinput',
    component: TimeInput,
    name:'TimeInput'
},{
    path: '/echatline',
    component: EchatLine,
    name:'EchatLine'
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
