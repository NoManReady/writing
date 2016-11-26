import Vue from 'vue';
import {
    SIZE,
    PREFIX,
    BEGIN_TIMER,
    PAUSE_TIMER,
    RESUME_TIMER,
    SET_LINE,
    SET_REMAIN_CONTENT,
    SET_REMAIN_TIME
} from './constant';
import JsTimer from '../../utils/timer';

export default {
    state: {
        timer: null,
        currentLine: 0,
        remainContent:'',
        remainTime:null,
        lineSize:100
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
            state.timer.startTimeline();
        },
        // line-mutations
        [SET_LINE](state,line){
          state.currentLine=line;
        },
        // remain-mutations
        [SET_REMAIN_CONTENT](state,content){
          state.remainContent=content;
        },
        [SET_REMAIN_TIME](state,timeObj){
            state.remainTime=timeObj;
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
        [`${PREFIX}remainTime`](state) {
            return state.remainTime;
        }
    }
}
