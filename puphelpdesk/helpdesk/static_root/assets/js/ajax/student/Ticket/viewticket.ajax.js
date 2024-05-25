$(function () {
    $('#AddCommentForm').on('submit', function (e) {
        addTicketComment(CommentAttachment)
        e.preventDefault() // prevent page refresh
    })
    verifyTicketId();
    $('#RateTicketForm').on('submit', function (e) {
        submitRating()
        e.preventDefault() // prevent page refresh
    })
})

function verifyTicketId() {
    const ticketId = getTicketIdFromURL();
    $.ajax({
        type: 'GET',
        url: `/api/student/verifyTicketInfo/${ticketId}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result.code == 401){
                window.location.href = '/Unauthorized'
            }
            else if (result.code == 404){
                window.location.href = '/Not_Found'
            }
            else{
                getTicketInfo(ticketId);
            }
        }
    })
}

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

function getTicketIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ticket_number');
}

CommentAttachment = FilePond.create(document.querySelector('#comment_Attachment'), {
    instantUpload: false,
    allowProcess: false,
})

getTicketInfo = (ticket_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getTicketInfo/${ticket_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            $('#ticket_Id_info').html(data.ticket_Id);
            $('#ticket_Number_info').html(data.ticket_Number);
            $('#ticket_full_Name_info').html(data.full_Name);
            $('#ticket_Title_info').html(data.ticket_Title);
            $('#ticket_Date_info').html(formatPostgresTimestamp(data.date_Created));
            $('#ticket_Office_info').html(data.ticket_Office);
            $('#ticket_Service_info').html(data.ticket_Service);
            $('#ticket_Type_info').html(data.ticket_Type);

            //Rating
            $('#rate_ticket_Number').val(data.ticket_Number);
            $('#rate_ticket_Office').val(data.ticket_Office);

            if (data.resolved_Date === null) {
                $('#resolved_Date_info').html(null);
            } else {
                $('#resolved_Date_info').html(formatPostgresTimestamp(data.resolved_Date));
            }

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

            const statusBadge = `<span class="${badgeClass}">${status}</span>`;
            $('#ticket_Status_info').html(statusBadge);

            $('#ticket_user_Id').val(data.user_Id);
            $('#ticket_Id').val(data.ticket_Id);
            $('#ticket_full_Name').val(data.full_Name);

            getTicketComment(data.ticket_Id, data.full_Name);

            //Display the form response
            let formshoworhide = $('#formshoworhide')

            let openformat = `<h2 class="text-center">Wait for Response</h2>
            <p class="text-center">Wait for the Administrator response before to reply again.</p>`

            let closedformat = `<h2 class="text-center">Ticket Resolved</h2>
            <p class="text-center">You may create a new ticket for your concern.</p>
            <div class="row justify-content-center">
                <div class="col-md-2 text-center">
                    <button class="btn btn-primary col-xl-12 mb-2" id="reopen_btn" onclick="TicketReOpen()">Re-Open</button>
                </div>
            </div>
            `

            if (data.ticket_Status == 'Resolved'){
                formshoworhide.html(null)
                formshoworhide.append(closedformat)
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Ticket Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

addTicketComment = (CommentAttachment) => {
    if ($('#AddCommentForm')[0]) {
        const form = new FormData($('#AddCommentForm')[0])
        
        const user_Id = $('#ticket_user_Id').val();
        const full_Name = $('#ticket_full_Name').val();
        const ticket_Id = $('#ticket_Id').val();
        const comment_Text = $('#comment_Text').val();


        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = CommentAttachment.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('comment_Attachment', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        Swal.fire({
            title: 'Submit',
            text: 'Once you submit your comment, you cannot edit this anymore.',
            icon: 'question',
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
                $('#comment_Submit').prop('disabled', true);
                notyf.open({
                    message: 'Submitting Comment. Please Wait...',
                    position: {x:'right',y:'top'},
                    background: 'gray',
                    duration: 3000
                });

                form.append('user_Id', user_Id);
                form.append('full_Name', full_Name);
                form.append('ticket_Id', ticket_Id);
                form.append('comment_Text', comment_Text);
                
                $.ajax({
                    type: 'POST',
                    url: '/api/student/addTicketComment',
                    dataType: 'json',
                    data: form,
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#comment_Submit').prop('disabled', true);
                            notyf.success({
                                message: 'Add Ticket Comment Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                            $('form#AddCommentForm')[0].reset();
                            location.reload();
                        }
                    },
                })
                .fail(() => {
                    Swal.fire({
                        title: 'Oops!',
                        text: 'Something went wrong while submitting ticket comment. Please try again.',
                        icon: 'error',
                        allowEnterKey: 'false',
                        allowOutsideClick: 'false',
                        allowEscapeKey: 'false',
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#D40429',
                    })
                    $('#comment_Submit').prop('disabled', false);
                })
            }
        })
    }
}

function getFileNameFromPath(filePath) {

    if (filePath == null) {
        return null;
    }

    // Use the last part of the path after the last '/'
    return filePath.substring(filePath.lastIndexOf('/') + 1);
}

// Time difference Function
function formatTimeAgo(timestamp) {
    var currentTime = new Date();
    var jsDate = new Date(timestamp);
    var timeDifference = currentTime.getTime() - jsDate.getTime();

    var secondsDifference = Math.floor(timeDifference / 1000);
    var minutesDifference = Math.floor(secondsDifference / 60);
    var hoursDifference = Math.floor(minutesDifference / 60);
    var daysDifference = Math.floor(hoursDifference / 24);
    var weeksDifference = Math.floor(daysDifference / 7);
    var monthsDifference = Math.floor(daysDifference / 30);
    var yearsDifference = Math.floor(daysDifference / 365);

    var result;
    if (yearsDifference > 0) {
        result = yearsDifference + (yearsDifference === 1 ? " year ago" : " years ago");
    } else if (monthsDifference > 0) {
        result = monthsDifference + (monthsDifference === 1 ? " month ago" : " months ago");
    } else if (weeksDifference > 0) {
        result = weeksDifference + (weeksDifference === 1 ? " week ago" : " weeks ago");
    } else if (daysDifference > 0) {
        result = daysDifference + (daysDifference === 1 ? " day ago" : " days ago");
    } else if (hoursDifference > 0) {
        result = hoursDifference + (hoursDifference === 1 ? " hour ago" : " hours ago");
    } else if (minutesDifference > 0) {
        result = minutesDifference + (minutesDifference === 1 ? " minute ago" : " minutes ago");
    } else {
        result = "Just now";
    }

    return result;
}


getTicketComment = (ticket_Id, full_Name) => {

    let chat_display = $('#chat_display')
    let get_full_Name = full_Name;

    $.ajax({
        type: 'GET',
        url: `/api/student/getTicketComment/${ticket_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let text = (data.comment_Text)?.replace(/\n/g, '</p><p>');
                    const fileName = getFileNameFromPath(data.comment_Attachment);
                    let download = null;
                    if (data.comment_Attachment != null) {
                        download = `<strong>Attachments:</strong> <p><a href="${data.comment_Attachment}" download>${fileName}</p>`
                    }
                    else{
                        download = ""
                    }

                    let studentchat =
                    `
                    <div class="chat-item mb-3">
                        <div class="row align-items-end justify-content-end">
                            <div class="col col-lg-6">
                                <div class="card bg-primary-lt">
                                    <div class="card-body">
                                        <div class="chat-bubble-title">
                                            <div class="row mb-2">
                                                <div class="col chat-bubble-author text-black"></div>
                                                <div class="col-auto chat-bubble-date text-black">${formatPostgresTimestamp(data.date_Created)} (${formatTimeAgo(data.date_Created)})</div>
                                            </div>
                                        </div>
                                        <div class="chat-bubble-body text-black">
                                            <p>${text}</p>
                                            ${download}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `

                    let adminchat = 
                    `
                    <div class="chat-item mb-3">
                        <div class="row align-items-end">
                            <div class="col col-lg-6">
                                <div class="card bg-secondary-lt">
                                    <div class="card-body">
                                        <div class="chat-bubble-title">
                                            <div class="row mb-2">
                                                <div class="col chat-bubble-author text-black"></div>
                                                <div class="col-auto chat-bubble-date text-black">${formatPostgresTimestamp(data.date_Created)} (${formatTimeAgo(data.date_Created)})</div>
                                            </div>
                                        </div>
                                        <div class="chat-bubble-body text-black">
                                            <p>${text}</p>
                                            ${download}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `

                    if (data.full_Name == get_full_Name){
                        chat_display.append(studentchat)
                    }
                    else {
                        chat_display.append(adminchat)
                    }




                });
            }
            
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Ticket Comment Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

submitRating = () => {
    $('#rating_Submit').prop('disabled', true);
    if ($('#RateTicketForm')[0].checkValidity()) {

        const ticket_Number = $('#rate_ticket_Number').val();
        const ticket_Office = $('#rate_ticket_Office').val();
        const ticket_Rating = $('#ticket_Rating').val();
        const ticket_Remarks = $('#ticket_Remarks').val();

        const data = {
            ticket_Number: ticket_Number,
            ticket_Office: ticket_Office,
            ticket_Rating: ticket_Rating,
            ticket_Remarks: ticket_Remarks
        };

        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure you want to rate this ticket?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#D40429',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/api/student/submitTicketRating',
                    data: data,
                    dataType: 'json',
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#rating_Submit').prop('disabled', true);
                            notyf.success({
                                message: 'Submit Feedback Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                            $('form#RateTicketForm')[0].reset();
                            $('#RateTicketModal').modal('hide');
                            location.reload();
                        }
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while submitting your Ratings. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                    },
                });
            }
        });
        $('#rating_Submit').prop('disabled', false);
    }
}

// Initialize star rating plugin
var stars = new StarRating('.star-rating');

// Get the select element
var selectElement = document.querySelector('.star-rating');

// Listen for change event on select element
selectElement.addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue !== "") {
        console.log("Selected rating:", selectedValue);
        $('#rating_Submit').prop('disabled', false);
        // Here you can add any further validation or processing logic you need
    } else {
        console.log("Please select a rating");
        $('#rating_Submit').prop('disabled', true);
        // Here you can handle the case where no rating is selected
    }
});

TicketReOpen = () => {

    const ticket_Number = $('#rate_ticket_Number').val();

    Swal.fire({
        title: 'Re-Open the ticket',
        html: 'Are you sure do you want to Re-Open the ticket?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, Re-open it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $('#reopen_btn').prop('disabled', true);
            $.ajax({
                type: 'PUT',
                url: `/api/student/ticketReOpen/${ticket_Number}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Ticket Re-Open Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while re-opening ticket. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#reopen_btn').prop('disabled', false);
            })
        }
    })
}