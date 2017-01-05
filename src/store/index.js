import Vue from 'vue';
import Vuex from 'vuex';
import * as type from './constant';

// 模块
import timeLine from './timeLine';
import typingMode from './typingMode';
import articleSetting from './articleSetting';
import myscore from './myscore';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //标题名称
        title: '',
        //是否加载中
        loading: false,
        // 登录用户
        user: window.user,
        // 导航
        breadcrumb: []
    },
    actions: {
        // 切换loading
        toggle_loading: ({
            commit
        }, loading) => {
            commit(type.APP_LOADING, loading);
        },
        // 切换title
        change_title: ({
            commit
        }, title) => {
            commit(type.APP_TITLE, title);
            document.title = title;
        },
        // 设置登录用户
        login_user: ({
            commit
        }, user) => {
            commit(type.LOGIN_USER, user);
        },
        // 改变路由
        change_crumb: ({
            commit
        }, option) => {
            commit(type.SET_CRUMB, option);
        }
    },
    mutations: {
        [type.APP_LOADING]: (state, isLoading) => {
            state.loading = isLoading;
        },
        [type.APP_TITLE]: (state, title) => {
            state.title = title;
        },
        [type.LOGIN_USER]: (state, user) => {
            state.user = user;
        },
        [type.SET_CRUMB]: (state, option) => {
            state.breadcrumb.splice(option.index, 99,option.route);
        }
    },
    getters: {
        title: state => {
            return state.title;
        },
        loading: (state, getters, root) => {
            return state.loading;
        },
        loginUser: (state) => {
            return state.user;
        },
        breadcrumb: (state) => {
            return state.breadcrumb;
        }
    },
    modules: {
        timeLine,
        typingMode,
        articleSetting,
        myscore
    }
})
