$(function() {
    /*Feedback and Suggestions*/
    feedbackChart1();
    feedbackChart2();
    feedbackChart3();
})

const notyf = new Notyf();

feedbackChart1 = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/FeedbackVsSuggestions',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('FeedbackVsSuggestion');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Feedback Count',
                subtext: 'Feedback v.s Suggestion',
                left: 'center'
            },
            toolbox: {
                feature: {
                saveAsImage: {
                    title: 'Save as Image',
                }
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '<b>{b}</b>: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                scroll: true,
            },
            series: [
                {
                type: 'pie',
                radius: ['60%','30%'],
                data: result,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
                }
            ]
            };
            
            option && myChart.setOption(option);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Feedback Chart 1 Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

feedbackChart2 = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/feedbackChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('FeedbackChart');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Feedback Count',
                subtext: 'Feedback Status Chart',
                left: 'center'
            },
            toolbox: {
                feature: {
                saveAsImage: {
                    title: 'Save as Image',
                }
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '<b>{b}</b>: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                scroll: true,
            },
            series: [
                {
                type: 'pie',
                radius: ['60%','30%'],
                data: result,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
                }
            ]
            };
            
            option && myChart.setOption(option);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Feedback Chart 2 Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

feedbackChart3 = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/suggestionChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('SuggestionChart');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Suggestion Count',
                subtext: 'Suggestion Status Chart',
                left: 'center'
            },
            toolbox: {
                feature: {
                saveAsImage: {
                    title: 'Save as Image',
                }
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: '<b>{b}</b>: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                scroll: true,
            },
            series: [
                {
                type: 'pie',
                radius: ['60%','30%'],
                data: result,
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
                }
            ]
            };
            
            option && myChart.setOption(option);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Feedback Chart 3 Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}