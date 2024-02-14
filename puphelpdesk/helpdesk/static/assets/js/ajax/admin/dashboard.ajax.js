$(function() {
    /*Feedback and Suggestions*/
    feedbackChart1();
    feedbackChart2();
    feedbackChart3();
    /*Other Charts*/
    financialAidChart();
    careerChart();
    servicereferralChart();
    idandcardChart();
    studentgovernmentChart();
    healthfacilityChart();
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
                    text: 'Overall Counts',
                    subtext: 'Feedback v.s Suggestion',
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
                    trigger: 'axis',
                    formatter: '<b>{b}</b>: {c} ',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    scroll: true,
                },
                xAxis: {
                    type: 'category',
                    data: result.map(item => item.name)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        stack: 'total',
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

financialAidChart = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/financialaidChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('FinancialAidChart');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Financial Aid and Scholarship',
                subtext: 'Count Chart',
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
            message: 'Financial Aid Chart Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

careerChart = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/careerChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('CareerChart');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Career Chart',
                subtext: 'Job v.s Internship',
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
            message: 'Career Chart Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

servicereferralChart = () => {
    $.ajax({
        type: 'GET',
        url: '/api/admin/servicereferralChart',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            var chartDom = document.getElementById('ServiceReferralChart');
            var myChart = echarts.init(chartDom);
            var option;
            
            option = {
            title: {
                text: 'Service Referral Chart',
                subtext: 'On-Campus v.s Community',
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
            message: 'Service Referral Chart Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

$(function() {
    // Function to fetch data for all three charts
    var fetchDataForAllCharts = () => {
        var idandcardData, studentgovernmentData, healthfacilityData;

        // AJAX request for ID and Card Chart data
        $.ajax({
            type: 'GET',
            url: '/api/admin/idandcardChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                idandcardData = result;
                renderMergedChart(idandcardData, studentgovernmentData, healthfacilityData);
            },
            error: () => {
                notyf.error({
                    message: 'ID and Card Chart Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });

        // AJAX request for Student Government Chart data
        $.ajax({
            type: 'GET',
            url: '/api/admin/studentgovernmentChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                studentgovernmentData = result;
                renderMergedChart(idandcardData, studentgovernmentData, healthfacilityData);
            },
            error: () => {
                notyf.error({
                    message: 'Student Government Chart Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });

        // AJAX request for Health Facility Chart data
        $.ajax({
            type: 'GET',
            url: '/api/admin/healthfacilityChart',
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                healthfacilityData = result;
                renderMergedChart(idandcardData, studentgovernmentData, healthfacilityData);
            },
            error: () => {
                notyf.error({
                    message: 'Health Facility Chart Fetching Error',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        });
    };


    var renderMergedChart = (idandcardData, studentgovernmentData, healthfacilityData) => {
        if (idandcardData && studentgovernmentData && healthfacilityData) {
            var mergedData = [];


            mergedData.push(...idandcardData);
            mergedData.push(...studentgovernmentData);
            mergedData.push(...healthfacilityData);

            var chartDom = document.getElementById('MergedChart');
            var myChart = echarts.init(chartDom);
            var option = {
                title: {
                    text: 'Merged Chart',
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
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    };


    fetchDataForAllCharts();
});