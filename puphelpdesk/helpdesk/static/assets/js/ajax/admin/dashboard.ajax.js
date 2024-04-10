$(function() {
    getuserfullname();
    /*Feedback and Suggestions*/
    feedbackChart1();
    feedbackChart2();
    feedbackChart3();
    /*Other Charts*/
    ticketChart();
})

const notyf = new Notyf();

//Time and Date
var cdate = new Date();
$('#current_Date').append(cdate.toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'}))

var uctime = new Date();
    $('#current_Time').append(uctime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))

function updateCurrentTime() {
    $('#current_Time').html(null)
    var uctime = new Date();
    $('#current_Time').append(uctime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))
}

// The will update the time within a second  
setInterval(updateCurrentTime, 1000);

getuserfullname = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#admin_name').html(profiledata.admin_First_Name+" "+ profiledata.admin_Last_Name);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Fetch Profile Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}


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
                    text: 'Overall Counts',
                    subtext: 'Feedback v.s Suggestion',
                    left: 'center',
                    bottom: '5%'
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
                left: 'center',
                bottom: '5%'
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
                left: 'center',
                bottom: '5%'
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

ticketChart = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/ticketstatusChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('TicketStatus');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Ticket Status Count',
                left: 'center',
                bottom: '5%'
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
            message: 'Ticket Chart Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

$(function() {
    var fetchDataForAllCharts = () => {
        var FinancialAidData, studentgovernmentData, careerData;

        // Financial Aid chart dito
        $.ajax({
            type: 'GET',
            url: '/api/admin/financialaidChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                FinancialAidData = result;
                renderMergedChart(FinancialAidData, studentgovernmentData, careerData);
            },
            error: () => {
                notyf.error({
                    message: 'Financial Aid Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });

        // Student Government dito
        $.ajax({
            type: 'GET',
            url: '/api/admin/studentgovernmentChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                studentgovernmentData = result;
                renderMergedChart(FinancialAidData, studentgovernmentData, careerData);
            },
            error: () => {
                notyf.error({
                    message: 'Student Government Chart Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });

        // Financial Aid Dito 
        $.ajax({
            type: 'GET',
            url: '/api/admin/careerChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                careerData = result;
                renderMergedChart(FinancialAidData, studentgovernmentData, careerData);
            },
            error: () => {
                notyf.error({
                    message: 'Career Chart Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });
    };


    var renderMergedChart = (FinancialAidData, studentgovernmentData, careerData) => {
        if (FinancialAidData && studentgovernmentData && careerData) {
            var mergedData = [];
    
            mergedData.push(...FinancialAidData);
            mergedData.push(...studentgovernmentData);
            mergedData.push(...careerData);
    
            var chartDom = document.getElementById('MergedChart');
            var myChart = echarts.init(chartDom);
            var option = {
                title: {
                    text: 'Other Services Count',
                    left: 'center',
                    bottom: '1%'
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
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    scroll: true,
                },
                dataset: {
                    source: mergedData
                },
                xAxis: { type: 'value' },
                yAxis: { type: 'category' },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            x: 'value',
                            y: 'category'
                        },
                        itemStyle: {
                            color: function(params) {
                                var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                                return colorList[params.dataIndex % colorList.length];
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };

    fetchDataForAllCharts();
});
