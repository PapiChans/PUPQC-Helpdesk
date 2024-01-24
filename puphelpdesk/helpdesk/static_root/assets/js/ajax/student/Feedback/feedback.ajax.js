$(function() {
    $('#submitFeedbackForm').on('submit', function (e) {
        e.preventDefault()
        submitFeedback()
    })
    getFeedback()
    getuserdata()
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

getuserdata = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#user_Id').val(profiledata.user_Id);
            $('#student_Name').val(profiledata.user_Last_Name+", "+ profiledata.user_First_Name);
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

submitFeedback = () => {

    if ($('#submitFeedbackForm')[0].checkValidity()) {
        const form = new FormData($('#submitFeedbackForm')[0]);
        const user_Id = $('#user_Id').val();
        const student_Id = $('#student_Id').val();
        const student_Name = $('#student_Name').val();
        const feedback_Type = $('#feedback_Type').val();
        const feedback_Text = $('#feedback_Text').val();


        const data = {
            user_Id: user_Id,
            student_Id: student_Id,
            student_Name: student_Name,
            feedback_Type: feedback_Type,
            feedback_Text: feedback_Text,
        };

        Swal.fire({
            title: 'Warning',
            text: 'Once you submit your feedback/suggestion, you cannot edit this anymore.',
            icon: 'warning',
            allowEnterKey: 'false',
            allowOutsideClick: 'false',
            allowEscapeKey: 'false',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonClass: 'btn btn-danger w-xs mb-1',
            confirmButtonColor: '#D40429',
        })
        .then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/api/student/submitFeedback',
                    data: data,
                    dataType: 'json',
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#feedback_Submit').prop('disabled', true);
                            notyf.success({
                                message: 'Submit Feedback Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                                $('form#submitFeedbackForm')[0].reset();
                                $('#FeedbackModal').modal('hide');

                                setTimeout(function () {
                                    location.reload()
                                }, 2600);
                        }
                    },
                })
            }
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while submitting your Feedback / Suggestion. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
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
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#FeedbackInfoModal" onclick="getFeedbackInfo('${data.feedback_Id}')"><i class="fa-solid fa-exclamation-circle"></i> Info</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteFeedback('${data.feedback_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                `
                    },
                },
            ],
            drawCallback: function() {
                // Count the number of 'Feedback' entries after each draw
                fcount = 0;
                scount = 0;
                this.api().rows().every(function() {
                    const type = this.data().feedback_Type;
                    if (type == 'Feedback') {
                        fcount++;
                    }
                    else if (type == 'Suggestion') {
                        scount++;
                    }
                });
    
                $('#feedback_count').text(fcount);
                $('#suggestion_count').text(scount);
            },
            order: [[1, 'desc']],
        })
    }
    notyf.success({
        message: 'Feedbacks Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
}

getFeedbackInfo = (feedback_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getFeedbackInfo/${feedback_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const feedbackInfodata = result;
            let feedback_Date = formatPostgresTimestamp(feedbackInfodata.date_Created)
            let stat = feedbackInfodata.feedback_Status
            if (feedbackInfodata.feedback_Status === 'New'){
                stat = '<span class="badge bg-blue text-blue-fg">New</span>'
            }
            else if (feedbackInfodata.feedback_Status === 'Read') {
                stat = `<span class="badge bg-yellow text-yellow-fg">Read</span>`
            }
            else if (feedbackInfodata.feedback_Status === 'Deleted') {
                stat = `<span class="badge bg-red text-red-fg">Deleted</span>`
            }
            else {
                stat = `<span class="badge bg-azure text-azure-fg">Unknown</span>`
            }
            $('#info_student_Id').html(feedbackInfodata.student_Id);
            $('#info_student_Name').html(feedbackInfodata.student_Name);
            $('#info_feedback_Type').html(feedbackInfodata.feedback_Type);
            $('#info_feedback_Date').html(feedback_Date);
            $('#info_feedback_Status').html(stat);
            $('#info_feedback_Text').html(feedbackInfodata.feedback_Text);
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

deleteFeedback = (feedback_Id) => {

    Swal.fire({
        title: 'Delete Feedback',
        html: 'Are you sure do you want to delete this feedback / suggestion?',
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
                url: `/api/student/deleteFeedback/${feedback_Id}`,
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