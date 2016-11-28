import Vue from 'vue';
import {
    SIZE,
    PREFIX,
    BEGIN_TIMER,
    PAUSE_TIMER,
    RESUME_TIMER,
    SET_LINE,
    SET_REMAIN_CONTENT,
    SET_REMAIN_PREV
} from './constant';
import JsTimer from '../../utils/timer';

export default {
    state: {
        // 定时器
        timer: null,
        // 当前编辑行
        currentLine: 0,
        // 剩余字符
        remainContent:'',
        // 剩余时间及长度
        remainPrev:null,
        // 每行字符数（单字符）
        lineSize:150,
        // 总时间
        totalTime:0
    },
    actions: {
        // timer-actions
        begin_timer({
            commit
        }) {
            commit(BEGIN_TIMER);
        },
        pause_timer({
            commit
        }) {
            commit(PAUSE_TIMER);
        },
        resume_timer({
            commit
        }) {
            commit(RESUME_TIMER);
        }

    },
    mutations: {
      // timer-mutations
        [BEGIN_TIMER](state) {
            state.timer = new JsTimer();
            state.timer.startTimeline();
        },
        [PAUSE_TIMER](state) {
            state.timer.pauseTimeline();
        },
        [RESUME_TIMER](state) {
            state.timer.resumeTimeline();
        },
        // line-mutations
        [SET_LINE](state,line){
          state.currentLine=line;
        },
        // remain-mutations
        [SET_REMAIN_CONTENT](state,content){
          state.remainContent=content;
        },
        [SET_REMAIN_PREV](state,timeObj){
            state.remainPrev=timeObj;
        }
    },
    getters: {
        [`${PREFIX}size`](state) {
            return state.lineSize;
        },
        [`${PREFIX}timer`](state) {
            return state.timer;
        },
        [`${PREFIX}line`](state) {
            return state.currentLine;
        },
        [`${PREFIX}remainContent`](state) {
            return state.remainContent;
        },
        [`${PREFIX}remainPrev`](state) {
            return state.remainPrev;
        }
    }
}
