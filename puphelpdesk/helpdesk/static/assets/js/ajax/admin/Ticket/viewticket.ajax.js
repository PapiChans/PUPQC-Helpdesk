$(function () {
    $('#AddCommentForm').on('submit', function (e) {
        addTicketComment(CommentAttachment)
        e.preventDefault() // prevent page refresh
    })
    verifyTicketId();
    $('#EditTicketForm').on('submit', function (e) {
        const ticket_Id = $('#ticket_Id_info').val();
        editTicket(ticket_Id)
        e.preventDefault() // prevent page refresh
    })
})

function verifyTicketId() {
    const ticketId = getTicketIdFromURL();
    $.ajax({
        type: 'GET',
        url: `/api/admin/verifyTicketInfo/${ticketId}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result.code == 404){
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
        url: `/api/admin/getTicketInfo/${ticket_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            $('#ticket_Id_info').val(data.ticket_Id);
            $('#ticket_Number_info').html(data.ticket_Number);
            $('#ticket_full_Name_info').html(data.full_Name);
            $('#ticket_Title_info').html(data.ticket_Title);
            $('#ticket_Status_info').html(`<span class="badge bg-secondary">${data.ticket_Status}</span>`);
            $('#ticket_Date_info').html(formatPostgresTimestamp(data.date_Created));
            $('#ticket_Service_info').html(data.ticket_Service);
            $('#ticket_Type_info').html(data.ticket_Type);

            if (data.resolved_Date === null) {
                $('#resolved_Date_info').html(null);
            } else {
                $('#resolved_Date_info').html(formatPostgresTimestamp(data.resolved_Date));
            }

            // For editing forms
            $('#edit_ticket_Status').val(data.ticket_Status)
            $('#edit_ticket_Office').val(data.ticket_Office)

            let ticket_Priority = data.ticket_Priority;
            let badgeClass = '';

            switch(ticket_Priority) {
                case 'Unassigned':
                    badgeClass = 'badge bg-secondary text-secondary-fg';
                    break;
                case 'Low':
                    badgeClass = 'badge bg-blue text-blue-fg'; // You can choose your preferred color
                    break;
                case 'Medium':
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

            const priorityBadge = `<span class="${badgeClass}">${ticket_Priority}</span>`;
            $('#ticket_Priority_info').html(priorityBadge);
            
            $('#ticket_Id').val(data.ticket_Id);

            getadmininfoforticket();
            getTicketComment(data.ticket_Id, data.full_Name);

            //Display the form response
            let formshoworhide = $('#formshoworhide');

            let openformat = `<div class="text-center">
                <h2 class="text-center">Wait for Response</h2>
                <p class="text-center">Wait for the Student response before to reply again.</p>
                <button type="button" class="btn btn-danger" id="ticket_closed_btn" onclick="MarkAsClosed('${data.ticket_Id}')">Close Ticket</button>
            </div>
            `;
            
            let closedformat = `<h2 class="text-center">Ticket Resolved</h2>
            <p class="text-center">This ticket is resolved.</p>
            `

            if (data.ticket_Status == 'Open'){
                $('#comment_Submit').prop('disabled', false);
            }
            else if (data.ticket_Status == 'Replied'){
                formshoworhide.html(null)
                formshoworhide.append(openformat)
            }
            else if (data.ticket_Status == 'Resolved'){
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
            title: 'Warning',
            text: 'Once you submit your comment, you cannot edit this anymore. Please review the following details carefully before submitting your message.',
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
                    url: '/api/admin/addTicketComment',
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

editTicket = (ticket_Id) => {

    if ($('#EditTicketForm')[0].checkValidity()) {
        const form = new FormData($('#EditTicketForm')[0]);

        $('#edit_Submit').prop('disabled', true);
        
        const ticket_Office = $('#edit_ticket_Office').val();
        const ticket_Id = $('#ticket_Id_info').val();

        const data = {
            ticket_Office: ticket_Office,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editTicket/${ticket_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_Submit').prop('disabled', false);
                    notyf.success({
                        message: 'Edit Ticket Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Ticket. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_Submit').prop('disabled', false);
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
        url: `/api/admin/getTicketComment/${ticket_Id}`,
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

                    if (data.full_Name != get_full_Name){
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

getadmininfoforticket = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#ticket_user_Id').val(profiledata.user_Id);
            $('#ticket_full_Name').val(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
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

MarkAsClosed = (ticket_Id) => {

    Swal.fire({
        title: 'Close the ticket',
        html: 'Are you sure do you want to close the ticket?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, close it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $('#ticket_closed_btn').prop('disabled', true);
            $.ajax({
                type: 'DELETE',
                url: `/api/admin/ticketClosed/${ticket_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Ticket Close Successfully',
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
                    text: 'Something went wrong while closing ticket. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#ticket_closed_btn').prop('disabled', false);
            })
        }
    })
}