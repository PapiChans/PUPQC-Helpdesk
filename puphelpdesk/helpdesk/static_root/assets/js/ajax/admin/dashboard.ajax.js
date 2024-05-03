$(function() {
    getuserfullname();
    /*Feedback and Suggestions*/
    feedbackChart1();
    feedbackChart2();
    feedbackChart3();
    /*Other Charts*/
    ticketChart();
    ticketCount();
    FeedbackandSuggestionCount();
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

ticketCount = () => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getTicketCount`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#response_ticket').html(data.replied);
            $('#open_ticket').html(data.open);
            $('#closed_ticket').html(data.closed);
            $('#total_ticket').html(data.totalticket);
            $('#total_messages').html(data.totalticketcomment);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Fetch Ticket Count Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

FeedbackandSuggestionCount = () => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getFeedbacksCount`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#NewFeedbackCount').html(data.new_feedback);
            $('#ReadFeedbackCount').html(data.read_feedback);
            $('#DeletedFeedbackCount').html(data.deleted_feedback);
            $('#NewSuggestionsCount').html(data.new_suggestion);
            $('#ReadSuggestionsCount').html(data.read_suggestion);
            $('#DeletedSuggestionsCount').html(data.deleted_suggestion);
            $('#TotalFeedbackCount').html(data.total_feedback);
            $('#TotalSuggestionCount').html(data.total_suggestion);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Fetch Feedbacks Count Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}