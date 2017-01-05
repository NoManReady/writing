import Index from '../components/home/Index';
import Articles from '../components/setting/Articles';
import Typing from '../components/typing/Typing';

import Test from '../components/test/Test';

// let Index = resolve => {
//     require(['../components/home/Index'], resolve);
// }
// let Articles = resolve => {
//     require(['../components/setting/Articles'], resolve);
// }
// let Typing = resolve => {
//     require(['../components/typing/Typing'], resolve);
// }
// let Test = resolve => {
//     require(['../components/test/Test'], resolve);
// }

export default [{
    path: '/home',
    component: Index,
    name: 'Index',
    meta: {
        title: '打字模式选择',
        level: 1
    }
}, {
    path: '/articles',
    component: Articles,
    name: 'Articles',
    meta: {
        title: '打字文章列表',
        level: 2
    }
}, {
    path: '/articles/:id',
    component: Typing,
    name: 'Typing',
    meta: {
        title: '打字测试',
        level: 3
    }
}, {
    path: '/test',
    component: Test,
    name: 'Test',
    meta: {
        title: '打字测试',
        level: 1
    }
}, {
    path: '*',
    redirect: '/home'
}];