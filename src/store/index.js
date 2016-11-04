import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        title: '',
        list: [],
        loading: false,
        activeLink: 1
    },
    actions: {
        show_loading: ({
            commit
        }) => {
            commit('SET_LOADING', true);
        },
        hide_loading: ({
            commit
        }) => {
            commit('SET_LOADING', false);
        },
        change_title: ({
            commit,
            state
        }, title) => {
            commit('SET_TITLE', title);
        }
    },
    mutations: {
        SET_TITLE: (state, title) => {
            state.title = title;
            document.title = title;
        },
        SET_LOADING: (state, isLoading) => {
            state.loading = isLoading;
        }
    },
    getters: {
        list: state => {
            return state.list;
        },
        title: state => {
            return state.title;
        },
        loading: state => {
            return state.loading;
        },
    }
})
