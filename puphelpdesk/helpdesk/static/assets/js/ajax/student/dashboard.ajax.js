$(function() {
    notifEvent();
    notifjobpost();
    notiflostitem();
    getuserfullname();
    getTicket();
    getFeedback();
})

const notyf = new Notyf();

function formatPostgresTimestamp(postgresTimestamp) {
    const date = new Date(postgresTimestamp);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

function getTicketInfoAndNavigate(ticketId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/user/ticket/view?ticket_number=${ticketId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getuserfullname = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#stud_name').html(profiledata.user_First_Name+" "+ profiledata.user_Last_Name);
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

notifEvent = () => {
    let event_display = $('#notif-event')
    $.ajax({
        type: 'GET',
        url: '/api/student/dashboard-event',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result && result.events && result.events.length > 0) {
                let event_format = `<div class="alert alert-info" role="alert">
                                        Check out the new
                                        <a href="geninfo/events" class="alert-link">Posted Events.</a> Save the date.
                                    </div>`
                event_display.append(event_format);
                $('#no-notif').html(null);
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Events Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

notifjobpost = () => {
    let jobpost_display = $('#notif-jobpost')
    $.ajax({
        type: 'GET',
        url: '/api/student/dashboard-jobpost',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result && result.jobpost && result.jobpost.length > 0) {
                let jobpost_format = `<div class="alert alert-info" role="alert">
                                        Go to
                                        <a href="careers/internship" class="alert-link">Job Posts.</a> If you're looking for a Job and Internshop Opportunities.
                                    </div>`
                jobpost_display.append(jobpost_format);
                $('#no-notif').html(null);
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Post Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

notiflostitem = () => {
    let lostitem_display = $('#notif-lostitem')
    $.ajax({
        type: 'GET',
        url: '/api/student/dashboard-lostitem',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result.message == 'Have Claim Items'){
                let lostitem_format = `<div class="alert alert-info" role="alert">
                                        You have Lost item(s) that marked for 
                                        <a href="LostAndFound/items" class="alert-link">Claim Verification.</a> Check it out.
                                    </div>`
                lostitem_display.append(lostitem_format);
                $('#no-notif').html(null);
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Post Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

// No Notification Dislay
// Check if #notif-event has no children
if ($('#notif-event','#notif-jobpost','#notif-lostitem').children().length === 0) {
    // No events appended, update UI accordingly
    $('#no-notif').html('No Notifications');
}

getTicket = () => {
    const dt = $('#ticket-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getTicketbyUser',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Number
                        return `${ticketnum}`
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    render: (data) => {
                        const title = data.ticket_Title
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let status = data.ticket_Status;
                        let badgeClass = '';
                        
                        switch(status) {
                            case 'Pending':
                                badgeClass = 'badge bg-silver text-silver-fg';
                                break;
                            case 'Open':
                                badgeClass = 'badge bg-yellow text-yellow-fg';
                                break;
                            case 'In Progress':
                                badgeClass = 'badge bg-cyan text-cyan-fg';
                                break;
                            case 'Approval':
                                badgeClass = 'badge bg-blue text-blue-fg';
                                break;
                            case 'On Hold':
                                badgeClass = 'badge bg-orange text-orange-fg';
                                break;
                            case 'Resolved':
                                badgeClass = 'badge bg-green text-green-fg';
                                break;
                            case 'Closed':
                                badgeClass = 'badge bg-black text-black-fg';
                                break;
                            default:
                                badgeClass = 'badge bg-danger text-danger-fg';
                        }
                        
                        return `<span class="${badgeClass}">${status}</span>`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                    let ticket_Priority = data.ticket_Priority;
                    let badgeClass = '';

                    switch(ticket_Priority) {
                        case 'Unassigned':
                            badgeClass = 'badge bg-secondary text-secondary-fg';
                            break;
                        case 'Low':
                            badgeClass = 'badge bg-blue text-blue-fg'; // You can choose your preferred color
                            break;
                        case 'Mid':
                            badgeClass = 'badge bg-green text-green-fg'; // You can choose your preferred color
                            break;
                        case 'High':
                            badgeClass = 'badge bg-orange text-orange-fg'; // You can choose your preferred color
                            break;
                        case 'Urgent':
                            badgeClass = 'badge bg-red text-red-fg'; // You can choose your preferred color
                            break;
                        default:
                            badgeClass = 'badge bg-danger text-danger-fg'; // Default color if priority is unknown
                    }

                    return `<span class="${badgeClass}">${ticket_Priority}</span>`;
                    },
                },           
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const date = formatPostgresTimestamp(data.date_Created)
                        return `${date}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        let content = '';
                        if (data === null || data.resolved_Date === null) {
                            content = ''; // Return empty string if data or resolved_Date is null
                        } else {
                            const date = formatPostgresTimestamp(data.resolved_Date);
                            content = `${date}`;
                        }
                        // Add feedback button if status is 'Closed' and closed by Admin
                        if (data.ticket_Status === 'Closed' && data.closed_By === 'Admin') {
                            content += `<br><a href="{% url 'feedback' %}?ticket_number=${data.ticket_Number}" class="btn btn-sm btn-primary mt-2">Provide Feedback</a>`;
                        }
                        return content;
                    }
                }                
            ],
            order: [[4, 'desc']],
        })
    }
}

getFeedback = () => {
    const dt = $('#feedback-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getFeedback',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const type = data.feedback_Type
                        return `${type}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const date = formatPostgresTimestamp(data.date_Created)
                        return `${date}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        let stat = data.feedback_Status
                        if (data.feedback_Status === 'New'){
                            stat = '<span class="badge bg-blue text-blue-fg">New</span>'
                        }
                        else if (data.feedback_Status === 'Read') {
                            stat = `<span class="badge bg-yellow text-yellow-fg">Read</span>`
                        }
                        else if (data.feedback_Status === 'Deleted') {
                            stat = `<span class="badge bg-red text-red-fg">Deleted</span>`
                        }
                        else {
                            stat = `<span class="badge bg-azure text-azure-fg">Unknown</span>`
                        }
                        return `${stat}`
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
}

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