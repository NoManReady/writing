import Vue from "vue";
import * as CONST from "./constant";
export default {
    state: {
        medalList: Object.freeze({
            reward_medal_info_list: [],
            un_reward_medal_info_list: []
        }),
        rankList: Object.freeze({
            print_type_rank: [],
            article_type_rank: [],
            article_rank: []
        }),
        progressList: Object.freeze([]),
        suggests: Object.freeze({
            mis_prints: [],
            slow_words: []
        })
    },
    actions: {
        my_medal({commit}){
            return Vue.http.get('/' + window.project_code + `/v1/my_medal`).then(response => {
                commit(CONST.MY_MEDAL, response.body);
            });
        },
        rank_list({commit}, typewriting_id){
            return Vue.http.get('/' + window.project_code + '/v1/rank/' + typewriting_id).then(response => {
                commit(CONST.RANK_LIST, response.body);
            });
        },
        search({commit}){
            return Vue.http.get('/' + window.project_code + '/v1/typewritings/search', {
                params: {
                    user_id: window.user.user_id,
                    page: 0,
                    size: 20
                }
            }).then(response => {
                commit(CONST.SEARCH, response.body);
            });
        },
        suggestList({commit}, typewriting_id){
            return Vue.http.get('/' + window.project_code + '/v1/typewritings/' + typewriting_id + '/typo_words').then(response => {
                commit(CONST.SUGGEST, response.body);
            });
        }
    },
    mutations: {
        [CONST.MY_MEDAL](state, medalList){
            state.medalList = Object.freeze(medalList);
        },
        [CONST.RANK_LIST](state, rankList){
            state.rankList = Object.freeze(rankList);
        },
        [CONST.SEARCH](state, data){
            state.progressList = Object.freeze(data);
        },
        [CONST.SUGGEST](state, data){
            state.suggests = Object.freeze(data);
        }
    },
    getters: {
        medalList(state){
            return state.medalList;
        },
        rankList(state){
            return state.rankList;
        },
        progressList(state){
            return state.progressList;
        },
        suggests(state){
            var list = state.suggests;

            function r(item) {
                return /[a-zA-Z]/g.test(item.word) || /[\u4e00-\u9fa5]/g.test(item.word);
            }

            return {
                'mis_prints': list.mis_prints.filter(r),
                'slow_words': list.slow_words.filter(r)
            };
        }
    }
}
