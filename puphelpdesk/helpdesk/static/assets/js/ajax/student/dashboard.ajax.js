$(function() {
    notifEvent();
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
                let event_format = `<div class="alert alert-success" role="alert">
                                        Check out the new
                                        <a href="geninfo/events" class="alert-link">Posted Events</a>. Save the date.
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

// No Notification Dislay
// Check if #notif-event has no children
if ($('#notif-event').children().length === 0) {
    // No events appended, update UI accordingly
    $('#no-notif').html('No Notifications');
}
