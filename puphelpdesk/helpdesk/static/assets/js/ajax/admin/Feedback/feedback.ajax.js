$(function() {
    getNewFeedback()
    getReadFeedback()
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
getNewFeedback = () => {
    const dt = $('#feedback-new-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getNewFeedback',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const name = data.student_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const stID = data.student_Id
                        return `${stID}`
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
                            stat = '<span class="badge-pill badge-info">New</span>'
                        }
                        else if (data.feedback_Status === 'Read') {
                            stat = `<span class="badge-pill badge-warning">Read</span>`
                        }
                        else if (data.feedback_Status === 'Deleted') {
                            stat = `<span class="badge-pill badge-danger">Deleted</span>`
                        }
                        else {
                            stat = `<span class="badge-pill badge-dark">Unknown</span>`
                        }
                        return `${stat}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-info waves-effect waves-light" data-toggle="modal" data-target="#FeedbackInfoModal" onclick="getFeedbackInfo('${data.feedback_Id}')"><i class="fa-solid fa-exclamation-circle"></i> Info</button>
                                `
                    },
                },
            ],
            order: [[2, 'desc']],
        })
    }
    notyf.success({
        message: 'New Feedbacks Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
}

getReadFeedback = () => {
    const dt = $('#feedback-read-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getReadFeedback',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            dom:
				"<'row'<'col-xl-12 mb-2'B>>" +
				"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                {
                    extend: 'print',
                    text: '<i class="fa-solid fa-print"></i> Print',
                    exportOptions: {
                        columns: [0, 1, 2],
                    },
                },
                {
                    extend: 'excel',
                    text: '<i class="fa-solid fa-file-excel"></i> Excel',
                    exportOptions: {
                        columns: [0, 1, 2],
                    },
                },
                {
                    extend: 'pdf',
                    text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                    exportOptions: {
                        columns: [0, 1, 2],
                    },
                }
            ],
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const name = data.student_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const stID = data.student_Id
                        return `${stID}`
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
                            stat = '<span class="badge-pill badge-info">New</span>'
                        }
                        else if (data.feedback_Status === 'Read') {
                            stat = `<span class="badge-pill badge-warning">Read</span>`
                        }
                        else if (data.feedback_Status === 'Deleted') {
                            stat = `<span class="badge-pill badge-danger">Deleted</span>`
                        }
                        else {
                            stat = `<span class="badge-pill badge-dark">Unknown</span>`
                        }
                        return `${stat}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-info waves-effect waves-light" data-toggle="modal" data-target="#FeedbackInfoModal" onclick="getFeedbackInfo('${data.feedback_Id}')"><i class="fa-solid fa-exclamation-circle"></i> Info</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteFeedback('${data.feedback_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                `
                    },
                },
            ],
            order: [[2, 'desc']],
        })
    }
    notyf.success({
        message: 'Read Feedbacks Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
}

getFeedbackInfo = (feedback_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getFeedbackInfo/${feedback_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const feedbackInfodata = result;
            let feedback_Date = formatPostgresTimestamp(feedbackInfodata.date_Created)
            let stat = feedbackInfodata.feedback_Status
            if (feedbackInfodata.feedback_Status === 'New'){
                stat = '<span class="badge-pill badge-info">New</span>'
            }
            else if (feedbackInfodata.feedback_Status === 'Read') {
                stat = `<span class="badge-pill badge-warning">Read</span>`
            }
            else if (feedbackInfodata.feedback_Status === 'Deleted') {
                stat = `<span class="badge-pill badge-danger">Deleted</span>`
            }
            else {
                stat = `<span class="badge-pill badge-dark">Unknown</span>`
            }
            $('#info_student_Id').html(feedbackInfodata.student_Id);
            $('#info_student_Name').html(feedbackInfodata.student_Name);
            $('#info_feedback_Type').html(feedbackInfodata.feedback_Type);
            $('#info_feedback_Date').html(feedback_Date);
            $('#info_feedback_Status').html(stat);
            $('#info_feedback_Text').html(feedbackInfodata.feedback_Text);

            if (feedbackInfodata.feedback_Status === 'New'){
                feedbackMarkAsRead(feedbackInfodata.feedback_Id)
            }

        },
    })
    .fail(() => {
        notyf.error({
            message: 'Feedback Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

feedbackMarkAsRead = (feedback_Id) => {
    $.ajax({
        type: 'PUT',
        url: `/api/admin/feedbackMarkAsRead/${feedback_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.success({
                message: 'Feedback marked as read',
                position: {x:'right',y:'top'},
                duration: 2500
            });
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Feedback Marking Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

deleteFeedback = (feedback_Id) => {

    Swal.fire({
        title: 'Delete Feedback',
        html: 'Are you sure do you want to delete this suggestion?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: `/api/admin/deleteFeedback/${feedback_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Feedback Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting feedback. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
            })
        }
    })
}