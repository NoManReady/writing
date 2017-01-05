import Vue from 'vue';
import * as type from './constant';
import * as app from '../constant';
export default {
    state: {
        // 文章列表
        articles: [],
        // 文章数量
        articlesCount: 0,
        // 文章类别
        catalogs: [],
        // 分类数量
        catalogsCount: 0,
        // 编码提示类型 0：无 1:86版五笔 2:98版五笔 3：拼音
        code: 0,
        // 限时时间 单位：分钟
        limit: 1,
        // 选中文章id
        articleId: 0,
        // 选中文章类别
        catalogId: 0
    },
    actions: {
        // 重置数据
        reset_setting({
            commit
        }) {
            commit(type.RESET_SETTING);
        },
        // 设置用户配置数据
        set_userConfigure({
            commit
        }, config) {
            return Vue.http.put(`/${window.project_code}/v1/test_configurations`, config).then(response => {
                commit(type.SET_USERCONFIGURE, response.body);
            });

        },
        // 获取用户配置数据
        get_userConfigure({
            commit
        }) {
            return Vue.http.get(`/${window.project_code}/v1/test_configurations`).then(response => {
                commit(type.GET_USERCONFIGURE, response.body);
            });
        },
        // 获取文章列表
        get_articles({
            dispatch,
            commit
        }, {
            cid,
            query,
            append,
            silent
        }) {
            return Vue.http.get(`/${window.project_code}/v1/article_classifies/${cid}/articles`, {
                params: query,
                silent
            }).then(response => {
                commit(type.GET_ARTICLES, {...response.body,
                    append
                });
            });
        },
        // 删除文章
        del_article({
            commit
        }, aid) {
            return Vue.http.delete(`/${window.project_code}/v1/articles/${aid}`)
                .then((response) => {
                    commit(type.DEL_ARTICLE, aid);
                });
        },
        // 创建文章
        create_article({
            commit
        }, body) {
            return Vue.http.post(`/${window.project_code}/v1/articles`, body)
                .then((response) => {
                    commit(type.CREATE_ARTICLE, response.body);
                });
        },
        // 获取分类列表
        get_catalogs({
            commit
        }, catalogType) {
            return Vue.http.get(`/${window.project_code}/v1/article_types/${catalogType}/article_classifies`).then(response => {
                commit(type.GET_CATALOGS, response.body);
            });
        },
        // 设置编码提示
        set_code({
            commit
        }, code) {
            commit(type.SET_CODE, code);
        },
        // 设置时限
        set_limit({
            commit
        }, limit) {
            commit(type.SET_LIMIT, limit);
        },
        // 设置当前文章id
        set_articleid({
            commit
        }, aid) {
            commit(type.SET_ARTICLEID, aid);
        },
        // 设置当前文章类别id
        set_catalogid({
            commit
        }, cid) {
            commit(type.SET_CATALOGID, cid);
        }
    },
    mutations: {
        [type.RESET_SETTING](state) {
            state.articles = [];
            state.catalogs = [];
            state.code = 0;
            state.limit = 0;
            state.articleId = 0;
            state.catalogId = 0;
        },
        [type.GET_USERCONFIGURE](state, config) {
            state.limit = /[0-9]/.test(config.limit_time) ? config.limit_time : 1;
            state.code = config.code_prompt_type || 0;
        },
        [type.SET_USERCONFIGURE](state, config) {

        },
        [type.GET_ARTICLES](state, {
            items,
            total,
            append
        }) {
            if (append) {
                state.articles.push(...items);
            } else {
                state.articles = items ? items : [];
                state.articlesCount = total;
            }
        },
        [type.DEL_ARTICLE](state, aid) {
            state.articles.splice(_.findIndex(state.articles, {
                id: aid
            }), 1);
            state.articlesCount -= 1;
        },
        [type.CREATE_ARTICLE](state, article) {
            state.articleId = article.id;
            state.articles.push(article);
            state.articlesCount += 1;
        },
        [type.GET_CATALOGS](state, catalogs) {
            state.catalogs = catalogs ? catalogs : [];
            state.catalogsCount = catalogs ? catalogs.length : 0;
        },
        [type.SET_CODE](state, code) {
            state.code = code;
        },
        [type.SET_LIMIT](state, limit) {
            state.limit = limit;
        },
        [type.SET_ARTICLEID](state, aid) {
            state.articleId = aid;
        },
        [type.SET_CATALOGID](state, cid) {
            state.catalogId = cid;
        }
    },
    getters: {
        articles(state) {
            return state.articles;
        },
        articlesCount(state) {
            return state.articlesCount;
        },
        catalogs(state) {
            return state.catalogs;
        },
        typingCode(state) {
            return state.code;
        },
        typingLimit(state) {
            return state.limit;
        },
        typingAid(state) {
            return state.articleId;
        },
        typingCid(state) {
            return state.catalogId;
        },
        typingName(state, getters) {
            return _.result(_.find(state.articles, {
                id: state.articleId
            }), 'title');
        },
        typingArticle(state) {
            return _.find(state.articles, {
                id: state.articleId
            });
        },
        catalogName(state) {
            return _.result(_.find(state.catalogs, {
                id: state.catalogId
            }), 'classify_name');
        }
    }
}
