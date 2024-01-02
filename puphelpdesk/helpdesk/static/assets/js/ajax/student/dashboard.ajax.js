$(function() {
    notifEvent();
    notifjobpost();
})

const notyf = new Notyf();

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

// No Notification Dislay
// Check if #notif-event has no children
if ($('#notif-event','#notif-jobpost').children().length === 0) {
    // No events appended, update UI accordingly
    $('#no-notif').html('No Notifications');
}
