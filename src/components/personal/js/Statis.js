import {mapGetters, mapActions} from "vuex";
import echarts from "../directives/echarts";

export default {
    name: 'Statis',
    data () {
        return {
            line: {}
        };
    },
    directives: {
        echarts
    },
    computed: {
        ...mapGetters(['progressList'])
    },
    methods: {
        ...mapActions(['search'])
    },
    created () {
        this.search();
    },
    watch: {
        progressList(nd){
            let that = this;
            let a1 = [];
            let a2 = [];
            let a3 = [];
            let x = [];
            let max = 0;
            let interval = 0;
            this.line = {
                title: {
                    text: '进步曲线(近20次)',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'normal'
                    },
                    left: 18,
                    top: 15
                },
                legend: {
                    bottom: 10,
                    data: ['平均速度', '正确字速度', '正确率']
                },
                tooltip: {},
                grid: {
                    top: 60,
                    right: 60,
                    bottom: 60,
                    left: 80
                },
                xAxis: {data: x},
                yAxis: [{
                    position: 'left',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    interval: 50,
                    axisLabel: {
                        formatter: '{value}字/分'
                    },
                    max: 200,
                    min: 0
                }, {
                    position: 'right',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    min: 0,
                    max: 1,
                    interval: 0.25,
                    axisLabel: {
                        formatter (value, index) {
                            return value * 100 + '%';
                        }
                    }
                }],
                series: [{
                    name: '平均速度',
                    type: 'line',
                    yAxisIndex: 0,
                    data: []
                }, {
                    name: '正确字速度',
                    type: 'line',
                    yAxisIndex: 0,
                    data: []
                }, {
                    name: '正确率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: []
                }]
            };

            nd.items.forEach((item, index) => {
                x.push(index + 1);
                a1.push({value: item.avg_speed});
                a2.push({value: item.right_speed});
                a3.push({value: item.accuracy / 100});
                max = max > item.avg_speed ? max : item.avg_speed;
                max = max > item.right_speed ? max : item.right_speed;
            });

            if (max == 0)
                max = 100;

            let length = ('' + max).length;
            let fix = Math.pow(10, length - 2);
            interval = Math.ceil(max / 4 / fix) * fix;
            max = interval * 4;
            this.line.yAxis[0].max = max;
            this.line.yAxis[0].interval = interval;
            that.line.series[0].data = a1;
            that.line.series[1].data = a2;
            that.line.series[2].data = a3;
        }
    }

};
