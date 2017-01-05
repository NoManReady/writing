import Vue from 'vue';
import * as type from './constant';
import JsTimer from '../../utils/timer';
import {
    getStringByLength
} from '../../utils';

export default {
    state: {
        // 文章内容（原文）
        content: Object.freeze([]),
        // 文章编码列表
        codeList: Object.freeze([]),
        // 定时器
        timer: null,
        // 是否开始定时
        isPause: false,
        // 当前编辑行
        currentLine: 0,
        // 每页项目数
        pageSize: 5,
        // 剩余字符
        remainContent: '',
        // 剩余时间及长度
        remainPrev: null,
        // 每行字符数（单字符）
        lengthPerLine: 80,
        // 已输入行总字符数
        prevCursorPosition: 0,
        // 当前输入字符在内容中的位置
        currentWordPosition: 0,
        // 总错误{对应行号}
        totalErrorPosition: {},
        // 总正确{对应行号}
        totalCorrectPosition: {},
        // 单字耗时{对应行号}
        totalCharsTime: {},
        //本次测试得到的等级与勋章
        currentTestdata: {},
        // 整合统计数据
        allStatisticData: null
    },
    actions: {
        //设置并提交总统计数据
        post_data({
            commit
        }, data) {
            commit(type.SET_ALLDATA, data);
            return Vue.http.post(`/${window.project_code}/v1/typewritings`, data).then(response => {
                commit(type.POST_DATA, response.body);
            });
        },
        // 重新开始
        reset_timeline({
            dispatch,
            commit
        }) {
            commit(type.RESET_TIMELINE);
        },
        // 获取文章内容
        init_content({
            commit
        }, aid) {
            return Vue.http.get(`/${window.project_code}/v1/articles/${aid}`).then(response => {
                commit(type.INIT_CONTENT, response.body);
            });
        },
        // 获取编码提示列表
        init_codelist({
            commit
        }, {
            aid,
            code
        }) {
            return Vue.http.get(`/${window.project_code}/v1/articles/${aid}/chinese_prompts/${code}`).then(response => {
                commit(type.INIT_CODELIST, response.body);
            });
        },
        // 创建打字测试
        create_typing({
            commit
        }, typing) {
            return Vue.post(`/${window.project_code}/v1/typewritings`, {
                body: typing
            }).then((response) => {
                // console.log(response.body);
            });
        },
        // 开启时间定时器
        begin_timer({
            commit
        }) {
            commit(type.BEGIN_TIMER);
        },
        // 暂停时间定时器
        pause_timer({
            commit
        }) {
            commit(type.PAUSE_TIMER);
        },
        // 恢复时间定时器
        resume_timer({
            commit
        }) {
            commit(type.RESUME_TIMER);
        },
        // 设置打字总时间
        set_time({
            commit
        }, time) {
            commit(type.SET_TIME, time)
        },
        // 设置当前编辑行
        set_line({
            commit
        }, line) {
            commit(type.SET_LINE, line);
        },
        // 设置已输入行总字符数
        set_totalposition({
            commit
        }, count) {
            commit(type.SET_CURSOR_POSITION, count);
        },
        // 设置剩余内容
        set_remaincontent({
            commit
        }, content) {
            commit(type.SET_REMAIN_CONTENT, content);
        },
        // 设置上行剩余长度的单位时间
        set_remainprev({
            commit
        }, remainprev) {
            commit(type.SET_REMAIN_PREV, remainprev);
        },
        // 设置当前编辑字符位置
        set_currentWordPosition({
            commit
        }, position) {
            commit(type.SET_CURRENTWORD_POSITION, position);
        },
        // 设置单位字信息对象
        set_typingposition({
            commit
        }, position) {
            commit(type.SET_POSITION_PUSH, position);
        },
        // 设置更新单字耗时
        set_charsTime({
            commit
        }, charsTime) {
            commit(type.SET_CHARSTIME_PUSH, charsTime);
        }
    },
    mutations: {
        [type.POST_DATA](state, data) {
            state.currentTestdata = Object.freeze(data);
        },
        // 重新设置状态
        [type.RESET_TIMELINE](state) {
            state.content=Object.freeze([]);
            state.codeList=Object.freeze([]);
            state.currentLine = 0;
            state.isPause = false;
            state.prevCursorPosition = 0;
            state.currentWordPosition = 0;
            state.totalErrorPosition = {};
            state.totalCorrectPosition = {};
            state.totalCharsTime = {};
            state.allStatisticData = null;
            state.timer = null;
            state.remainPrev=null;
            state.remainContent='';
            state.currentTestdata={};
        },
        // 设置文章内容
        [type.INIT_CONTENT](state, article) {
            state.content = Object.freeze(article.content.map(c=>{
                return c.replace(/\r$/g,'');
            }));
        },
        // 设置文章编码
        [type.INIT_CODELIST](state, codeList) {
            state.codeList = Object.freeze(codeList);
        },
        // 开启时间定时器
        [type.BEGIN_TIMER](state) {
            state.timer = new JsTimer();
            state.timer.startTimeline();
        },
        // 暂停时间定时器
        [type.PAUSE_TIMER](state) {
            state.timer.pauseTimeline();
            state.isPause = true;
        },
        // 恢复时间定时器
        [type.RESUME_TIMER](state) {
            state.timer.resumeTimeline();
            state.isPause = false;
        },
        // 设置当前编辑行号
        [type.SET_LINE](state, line) {
            state.currentLine = line;
        },
        // 设置已输入行总字符数
        [type.SET_CURSOR_POSITION](state, count) {
            state.prevCursorPosition += count;
        },
        // 设置输入总时间
        [type.SET_TIME](state, time) {
            state.inputTime += time;
        },
        // 设置剩余字符
        [type.SET_REMAIN_CONTENT](state, content) {
            state.remainContent = content;
        },
        // 设置剩余时间及长度
        [type.SET_REMAIN_PREV](state, timeObj) {
            state.remainPrev = timeObj;
        },
        // 设置当前编辑字符位置
        [type.SET_CURRENTWORD_POSITION](state, position) {
            state.currentWordPosition = position;
        },
        // 设置错误正确对象
        [type.SET_POSITION_PUSH](state, positionData) {
            Vue.set(state.totalErrorPosition, positionData.line, positionData.data[0]);
            Vue.set(state.totalCorrectPosition, positionData.line, positionData.data[1]);
        },
        // 设置更新单字耗时
        [type.SET_CHARSTIME_PUSH](state, charsTimeData) {
            Vue.set(state.totalCharsTime, charsTimeData.line, charsTimeData.data);
        },
        // 设置总统计数据
        [type.SET_ALLDATA](state, alldata) {
            state.allStatisticData = alldata;
        }
    },
    getters: {
        articleContent(state) {
            return state.content;
        },
        lines(state) {
            const lines=[];
            const generate=(content)=>{
                let linesPer = [];
                // 截取段落字符串，直到分配完
                while (content) {
                    let size = state.lengthPerLine,
                        slice;
                    slice = getStringByLength(content, size);
                    linesPer.push(slice.content);
                    content = content.substr(slice.cursor);
                }
                return linesPer;
            }
            state.content.forEach((content) => {
                lines.push(...generate(content));
            });
            return lines;
        },
        codeList(state) {
            return state.codeList;
        },
        currentLine(state) {
            return state.currentLine;
        },
        lengthPerLine(state) {
            return state.lengthPerLine;
        },
        timer(state) {
            return state.timer;
        },
        increaseAble(state,getters){
            return state.currentLine<getters.lines.length;
        },
        pindex(state,getters) {
            let pIndex=Math.floor(state.currentLine / state.pageSize);
            let isFit=state.currentLine % state.pageSize===0;
            if(state.currentLine>=getters.lines.length&&isFit){
                pIndex--;
            }
            return pIndex;
        },
        psize(state) {
            return state.pageSize;
        },
        remainContent(state) {
            return state.remainContent;
        },
        remainPrev(state) {
            return state.remainPrev;
        },
        inputTime(state) {
            return state.inputTime;
        },
        totalCorrect(state) {
            return state.totalCorrectPosition;
        },
        totalError(state) {
            return state.totalErrorPosition;
        },
        totalCharsTime(state) {
            return state.totalCharsTime;
        },
        isPause(state) {
            return state.isPause;
        },
        prevCursorPosition(state) {
            return state.prevCursorPosition;
        },
        currentWordPosition(state) {
            return state.currentWordPosition;
        },
        allStatisticData(state) {
            return state.allStatisticData;
        },
        currentTestdata(state) {
            return state.currentTestdata;
        },
        myMedalList(state){
            return state.currentTestdata.reward_medals?state.currentTestdata.reward_medals.map((ewward)=>{
                for(let newMedal of state.currentTestdata.new_medals){
                    if(newMedal.name===ewward.name){
                        ewward.is_new=true;
                        break;
                    }
                }
                return ewward;
            }):[];
        }
    }
}
