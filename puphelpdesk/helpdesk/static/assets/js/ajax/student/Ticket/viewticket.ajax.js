$(function () {
    $('#AddCommentForm').on('submit', function (e) {
        addTicketComment(CommentAttachment)
        e.preventDefault() // prevent page refresh
    })
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

function getTicketIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ticket_number');
}

$(document).ready(function () {
    const ticketId = getTicketIdFromURL();
    if (ticketId) {
        getTicketInfo(ticketId);
    } else {
        console.error('Ticket ID not found in the URL');
    }
});

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
            $('#ticket_Description_info').html(data.ticket_Description.replace(/\n/g, '</p><p>'));
            $('#ticket_Date_info').html(formatPostgresTimestamp(data.date_Created));

            let status = data.ticket_Status
            if (data.ticket_Status == 'Open'){
                status = '<span class="badge bg-success text-success-fg">Open</span>'
            }
            else if (data.ticket_Status == 'Response') {
                status = `<span class="badge bg-warning text-success-fg">Response</span>`
            }
            else if (data.ticket_Status == 'Closed') {
                status = `<span class="badge bg-secondary text-success-fg">Closed</span>`
            }
            else if (data.ticket_Status == 'New') {
                status = `<span class="badge bg-info text-success-fg">New</span>`
            }
            else {
                status = `<span class="badge bg-secondary text-success-fg">Unknown</span>`
            }
            $('#ticket_Status_info').html(status);

            $('#ticket_user_Id').val(data.user_Id);
            $('#ticket_Id').val(data.ticket_Id);
            $('#ticket_full_Name').val(data.full_Name);

            getTicketComment(data.ticket_Id, data.full_Name);

            //Display the form response
            let formshoworhide = $('#formshoworhide')

            let openformat = `<h2 class="text-center">Wait for Response</h2>
            <p class="text-center">Wait for the Administrator response before to reply again.</p>`

            let closedformat = `<h2 class="text-center">Ticket Closed</h2>
            <p class="text-center">You may create a new ticket for your concern.</p>
            `

            if (data.ticket_Status == 'Open'){
                formshoworhide.html(null)
                formshoworhide.append(openformat)
            }
            else if (data.ticket_Status == 'Closed'){
                formshoworhide.html(null)
                formshoworhide.append(closedformat)
            }
            else{
                $('#comment_Submit').prop('disabled', false);
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
            title: 'Warning',
            text: 'Once you submit your comment, you cannot edit this anymore.',
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