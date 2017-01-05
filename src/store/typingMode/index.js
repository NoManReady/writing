import * as type from './constant';
export default {
    state: {
        // 打字模式
        mode: -1,
        // 打字模式hash表
        modeHash: Object.freeze([{
            mode: 0,
            name: '中文',
            img:require('../../assets/pink.png')
        }, {
            mode: 1,
            name: '英文',
            img:require('../../assets/blue.png')
        }, {
            mode: 2,
            name: '中英',
            img:require('../../assets/green.png')
        }])
    },
    actions: {
        // 设置打字模式
        set_mode({
            commit
        }, mode) {
            commit(type.SET_MODE, mode);
        }
    },
    mutations: {
        [type.SET_MODE](state, mode) {
            state.mode = mode;
        }
    },
    getters: {
        typingMode(state) {
            return state.mode;
        },
        modeHash(state) {
            return state.modeHash;
        },
        modeName(state){
            return _.result(_.find(state.modeHash,{mode:state.mode}),'name');
        }
    }
}
