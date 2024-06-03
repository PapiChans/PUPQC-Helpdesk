$(function () {
    $('#AddCommentForm').on('submit', function (e) {
        addRequestComment(CommentAttachment)
        e.preventDefault() // prevent page refresh
    })
    getRequestInfo(getRequestIdFromURL())
    hideResolveButton()
    $('#RateRequestForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        submitRating()
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

function getRequestIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('request_number');
}

CommentAttachment = FilePond.create(document.querySelector('#comment_Attachment'), {
    instantUpload: false,
    allowProcess: false,
})

getRequestInfo = (request_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getRequestInfo/${request_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            $('#request_Number_info').html(data.request_Number);
            $('#request_full_Name_info').html(data.full_Name);
            $('#request_Title_info').html(data.request_Title);
            $('#request_Office_info').html(data.request_Office);
            $('#request_Status_info').html(`<span class="badge bg-secondary">${data.request_Status}</span>`);
            $('#request_Date_info').html(formatPostgresTimestamp(data.date_Created));
            $('#request_Service_info').html(data.request_Service);
            $('#request_Type_info').html(data.request_Type);

            if (data.resolved_Date === null) {
                $('#resolved_Date_info').html(null);
            } else {
                $('#resolved_Date_info').html(formatPostgresTimestamp(data.resolved_Date));
            }

            
            //For rating
            $('#rate_request_Number').val(data.request_Number);
            $('#rate_request_Office').val(data.request_Office);
            $('#request_Id').val(data.request_Id);

            getadmininfoforticket();
            getTicketComment(data.request_Id);
            getAuditTrail(data.request_Number)

            //Display the form response
            let formshoworhide = $('#formshoworhide');

            let closedformat = `<div class="text-center">
                <h2 class="text-center">Request Closed</h2>
                <p class="text-center">This request is closed.</p>
            </div>
            `;
            
            let resolvedformat = `<h2 class="text-center">Request Resolved</h2>
            <p class="text-center">This request is resolved.</p>
            <div class="row justify-content-center">
                <div class="col-md-2 text-center">
                    <button type="button" class="btn btn-danger" id="ticket_closed_btn" onclick="MarkAsClosed('${data.request_Id}')">Close Request</button>
                </div>
            </div>
            `

            if (data.request_Status == 'Open'){
                $('#comment_Submit').prop('disabled', false);
            }
            else if (data.request_Status == 'Resolved'){
                formshoworhide.html(null)
                formshoworhide.append(resolvedformat)
            }
            else if (data.request_Status == 'Closed'){
                formshoworhide.html(null)
                formshoworhide.append(closedformat)
            }

            
        },
        
    })
    .fail(() => {
        notyf.error({
            message: 'Request Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
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

function getFileNameFromPath(filePath) {

    if (filePath == null) {
        return null;
    }

    // Use the last part of the path after the last '/'
    return filePath.substring(filePath.lastIndexOf('/') + 1);
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
            $('#request_user_Id').val(profiledata.user_Id);
            $('#request_full_Name').val(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
            hideResolveButton(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
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

getTicketComment = (request_Id) => {

    let chat_display = $('#chat_display')

    $.ajax({
        type: 'GET',
        url: `/api/admin/getRequestComment/${request_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {
                    let get_full_Name = $('#request_full_Name').val();
                    
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

getAuditTrail = (request_Number) => {
    let trailDisplay = $('#trailDisplay');
    trailDisplay.html(null);

    $.ajax({
        type: 'GET',
        url: `/api/admin/getAuditTrail/${request_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {
                    let format = `
                            <a style="cursor: pointer;" class="list-group-item list-group-item-action">
                            <h4>[${data.audit_Action}] ${data.audit_Description}</h4>
                            <p>User: ${data.audit_User}, <span class="text-primary">Date: ${formatPostgresTimestamp(data.date_Created)}</span></p>
                            </a>
                        `;
                    trailDisplay.append(format)
                });
            } else {
                notyf.success({
                    message: 'No Trail Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Trail Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    });
}

addRequestComment = (CommentAttachment) => {
    if ($('#AddCommentForm')[0]) {
        const form = new FormData($('#AddCommentForm')[0]);
        
        const request_user_Id = $('#request_user_Id').val();
        const request_full_Name = $('#request_full_Name').val();
        const request_Id = $('#request_Id').val();
        const comment_Text = $('#comment_Text').val();


        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond');
		}

        pondFiles = CommentAttachment.getFiles();
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('comment_Attachment', pondFiles[i].file);
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1]);
		}

        Swal.fire({
            title: 'Submit Reply',
            text: 'Please review the following details carefully before submitting your message.',
            icon: 'info',
            allowEnterKey: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
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

                form.append('user_Id', request_user_Id);
                form.append('full_Name', request_full_Name);
                form.append('request_Id', request_Id);
                form.append('comment_Text', comment_Text);
                
                $.ajax({
                    type: 'POST',
                    url: '/api/admin/addRequestComment',
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
                                message: 'Add Request Comment Successfully',
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
                        text: 'Something went wrong while submitting request comment. Please try again.',
                        icon: 'error',
                        allowEnterKey: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#D40429',
                    })
                    $('#comment_Submit').prop('disabled', false);
                })
            }
        })
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


hideResolveButton = (get_full_Name, request_full_Name) => {
    // Select the button to be hidden or shown
    let rateButton = $('#showResolved');

    // Compare the user's full name with the request's full name
    if (get_full_Name == request_full_Name) {
        rateButton.hide();
    } else {
        rateButton.show();
    }
}

submitRating = () => {
    $('#rating_Submit').prop('disabled', true);
    if ($('#RateRequestForm')[0].checkValidity()) {

        const request_Number = $('#rate_request_Number').val();
        const request_Rating = $('#request_Rating').val();

        const data = {
            request_Rating: request_Rating,
        };

        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure you want to rate this request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#D40429',
        }).then((result) => {
            if (result.isConfirmed) {
                $('#rating_Submit').prop('disabled', true);
                $.ajax({
                    type: 'PUT',
                    url: `/api/admin/submitRequestRating/${request_Number}`,
                    data: data,
                    dataType: 'json',
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#rating_Submit').prop('disabled', true);
                            notyf.success({
                                message: 'Submit Request Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                            $('form#RateRequestForm')[0].reset();
                            $('#RateRequestModal').modal('hide');
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

MarkAsClosed = (ticket_Id) => {

    Swal.fire({
        title: 'Close the request',
        html: 'Are you sure do you want to close the request?',
        icon: 'question',
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
                url: `/api/admin/requestClosed/${ticket_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Request Close Successfully',
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
                    text: 'Something went wrong while closing request. Please try again.',
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