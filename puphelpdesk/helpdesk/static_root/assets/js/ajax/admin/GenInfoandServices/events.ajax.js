$(function() {
    $('#AddEventForm').on('submit', function (e) {
        addEvent()
        e.preventDefault() // prevent page refresh
    })
    getEvent();
    $('#EditEventForm').on('submit', function (e) {
        editEvent()
        e.preventDefault() // prevent page refresh
    })
    $('#UploadImageEventForm').on('submit', function (e) {
        const event_Id = $('#upload_event_Id').val()
        uploadImageEvent(EventImage, event_Id)
        e.preventDefault() // prevent page refresh
    })
})

$('input[type="date"]').flatpickr({
    mode: 'single',
    minDate: "today",
    allowInput: true,
    dateFormat: "Y-m-d"
});
$('input[type="time"]').flatpickr({
    enableTime: true,
    allowInput: true,
    noCalendar: true,
    minTime: "06:00",
    maxTime: "00:00",
});

const notyf = new Notyf();

const ImageFileTypes = ['image/png', 'image/jpeg']

EventImage = FilePond.create(document.querySelector('#event_Image'), {
    instantUpload: false,
    allowProcess: false,
    acceptedFileTypes: ImageFileTypes,
    beforeAddFile: (file) => {
        // Check if the file type is not accepted
        if (!ImageFileTypes.includes(file.fileType)) {
            // Show an error message
            // * Sweetalert2 that will say: JPG, and PNG files are allowed
            Swal.fire({
                title: 'Something went wrong',
                text: `The file format you uploaded is ${file.fileType}`,
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            // Reject the file
            return false
        }
        // Continue with the file upload
        return true
    },
})

addEvent = () => {

    if ($('#AddEventForm')[0].checkValidity()) {
        const form = new FormData($('#AddEventForm')[0]);

        $('#event_Submit').prop('disabled', true);
        
        const event_Type = $('#event_Type').val();
        const event_Name = $('#event_Name').val();
        const event_Description = $('#event_Description').val();
        const event_Date_Start = $('#event_Date_Start').val();
        const event_Date_End = $('#event_Date_End').val();
        const event_Start = $('#event_Start').val();
        const event_End = $('#event_End').val();
        const event_Venue = $('#event_Venue').val();

        //Get the dates
        const currentTime = new Date();
        const eventStartTime = new Date(event_Date_Start + 'T' + event_Start);

        if (event_Date_Start > event_Date_End) {
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'You cannot set the date where the event date end is set before the event start date.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#event_Submit').prop('disabled', false);
        }
        else if (event_Start >= event_End) {
            // Check if end time is before or same as start time.
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'The end time cannot be before or the same as the start time on the same day.',
                icon: 'error',
                allowEnterKey: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            });
            $('#event_Submit').prop('disabled', false);
        }
        else if (event_Date_Start == event_Date_End && eventStartTime <= currentTime) {
            // If event start time is before or equal to current time, show error
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'You cannot set events for today after the current time.',
                icon: 'error',
                allowEnterKey: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            });
            $('#event_Submit').prop('disabled', false);
        }
        else {

            const data = {
                event_Type: event_Type,
                event_Name: event_Name,
                event_Description: event_Description,
                event_Date_Start: event_Date_Start,
                event_Date_End: event_Date_End,
                event_Start: event_Start,
                event_End: event_End,
                event_Venue: event_Venue,
            };
        
            $.ajax({
                type: 'POST',
                url: '/api/admin/addEvent',
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#event_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Event Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#AddEventForm')[0].reset();
                            $('#AddEventModal').modal('hide');
                                location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding event. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#event_Submit').prop('disabled', false);
            })
        }
    }
}

// Date Formatter
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // 24-Hour to 12-Hour Converter
    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // Convert to 12-hour format

        const time12 = `${hours12}:${minutes} ${period}`;
        return time12;
    }
    
    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    }

getEvent = () => {
    let ongoing_display = $('#ongoing_event_display')
    let upcoming_display = $('#upcoming_event_display')
    let ended_display = $('#ended_event_display')

    $.ajax({
        type: 'GET',
        url: '/api/admin/getEvent',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const eventdata = result;
            if (eventdata.length > 0) {
                eventdata.forEach((eventdata) => {
                    const formattedStartdate = formatDate(eventdata.event_Date_Start);
                    const formattedEnddate = formatDate(eventdata.event_Date_End);
                    const formattedStarttime = convertTo12HourFormat(eventdata.event_Start)
                    const formattedEndtime = convertTo12HourFormat(eventdata.event_End)

                    const currentDate = new Date();
                    const formattedCurrentdate = formatDateToYYYYMMDD(currentDate);

                    let imagehand = eventdata.event_Image;
                    if (imagehand == null) {
                        imagehand = `<button type="button" class="btn btn-info waves-effect waves-light mt-2" data-bs-toggle="modal" data-bs-target="#uploadImageEventModal" onclick="foruploadImage('${eventdata.event_Id}')"><i class="fa-solid fa-camera"></i> Upload Image</button>`
                    }
                    else {
                        imagehand = `<button type="button" class="btn btn-danger waves-effect waves-light mt-2" data-bs-toggle="modal" data-bs-target="#" onclick="deleteImageEvent('${eventdata.event_Id}')"><i class="fa-solid fa-trash"></i> Delete Image</button>`
                    }

                    let event_img = '/static/assets/images/default-image/event.png'
                    let workshop_img = '/static/assets/images/default-image/workshop.png'
                    let extraact_img = '/static/assets/images/default-image/extracurricular-activity.png'
                    let imgShow;

                    if (eventdata.event_Type == 'Event') {
                        imgShow = event_img;
                    }
                    if (eventdata.event_Type == 'Workshop') {
                        imgShow = workshop_img;
                    }
                    if (eventdata.event_Type == 'Extracurricular Activity') {
                        imgShow = extraact_img;
                    }

                    let eventformat = `
                        <div class="col-xl-4">
                            <div class="card mb-3">
                                <img src="${imgShow}" class="card-img-top img-fluid" id="image_thumbnail">
                                <div class="card-body">
                                    <h4 class="card-title font-size-16 mt-0 text-center" contenteditable="false" id="title-1">${eventdata.event_Name}</h4>
                                    <p class="card-text" contenteditable="false">Event Date: ${formattedStartdate} - ${formattedEnddate}</p>
                                    <p class="card-text" contenteditable="false">Event Time: ${formattedStarttime} - ${formattedEndtime}</p>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#editEventModal" onclick="foreditevent('${eventdata.event_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteEvent('${eventdata.event_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                        <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#eventInfoModal" onclick="getEventInfo('${eventdata.event_Id}')"><i class="fa-solid fa-circle-info"></i> Information</button>
                                        ${imagehand}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;

                        const eventStartDateTime = new Date(`${eventdata.event_Date_Start}T${eventdata.event_Start}`);
                        const eventEndDateTime = new Date(`${eventdata.event_Date_End}T${eventdata.event_End}`);
                        const currentDateTime = new Date();

                        if (eventStartDateTime <= currentDateTime && eventEndDateTime >= currentDateTime) {
                            // Event ongoing
                            $('#no_ongoing').html(null);
                            ongoing_display.append(eventformat);
                        } else if (eventStartDateTime > currentDateTime) {
                            // Event upcoming
                            $('#no_upcoming').html(null);
                            upcoming_display.append(eventformat);
                        } else {
                            // Event ended
                            $('#no_ended').html(null);
                            ended_display.append(eventformat);
                        }
                });
            }
            else {
                notyf.success({
                    message: 'No Events Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Events Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getEventInfo = (event_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getEventInfo/${event_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const eventInfodata = result;
            const InfoformattedStartdate = formatDate(eventInfodata.event_Date_Start);
            const InfoformattedEnddate = formatDate(eventInfodata.event_Date_End);
            const InfoformattedStarttime = convertTo12HourFormat(eventInfodata.event_Start)
            const InfoformattedEndtime = convertTo12HourFormat(eventInfodata.event_End)

            const fordate = `${InfoformattedStartdate} - ${InfoformattedEnddate}`;
            const fortime = `${InfoformattedStarttime} - ${InfoformattedEndtime}`;

            $('#event_name_info').html(eventInfodata.event_Name);
            $('#event_desc_info').html(eventInfodata.event_Description.replace(/\n/g, '</p><p>'));
            $('#event_date_info').html(fordate);
            $('#event_time_info').html(fortime);
            if (eventInfodata.event_Image != null){
                $('#event_image_info').attr('src', `${eventInfodata.event_Image}`)
            }
            else {
                $('#event_image_info').attr('src', '/static/assets/images/default-image/default-image-404.png')
            }
            $('#event_type_info').html(eventInfodata.event_Type);
            $('#event_venue_info').html(eventInfodata.event_Venue);
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

deleteEvent = (event_Id) => {

    Swal.fire({
        title: 'Delete Event',
        html: 'Are you sure do you want to delete this event?',
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
                url: `/api/admin/deleteEvent/${event_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Event Successfully',
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
                    text: 'Something went wrong while deleting event. Please try again.',
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

foreditevent = (event_Id) => getEventforEdit(event_Id)

getEventforEdit = (event_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getEventInfo/${event_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const editEventdata = result;
            $('#edit_event_Id').val(editEventdata.event_Id);
            $('#edit_event_Type').val(editEventdata.event_Type);
            $('#edit_event_Name').val(editEventdata.event_Name);
            $('#edit_event_Description').val(editEventdata.event_Description);
            $('#edit_event_Date_Start').val(editEventdata.event_Date_Start);
            $('#edit_event_Date_End').val(editEventdata.event_Date_End);
            $('#edit_event_Start').val(editEventdata.event_Start);
            $('#edit_event_End').val(editEventdata.event_End);
            $('#edit_event_Venue').val(editEventdata.event_Venue);
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

editEvent = (event_Id) => {

    if ($('#EditEventForm')[0].checkValidity()) {
        const form = new FormData($('#EditEventForm')[0]);
        $('#edit_event_Submit').prop('disabled', true);
        const event_Type = $('#edit_event_Type').val();
        const event_Id = $('#edit_event_Id').val();
        const event_Name = $('#edit_event_Name').val();
        const event_Description = $('#edit_event_Description').val();
        const event_Date_Start = $('#edit_event_Date_Start').val();
        const event_Date_End = $('#edit_event_Date_End').val();
        const event_Start = $('#edit_event_Start').val();
        const event_End = $('#edit_event_End').val();
        const event_Venue = $('#edit_event_Venue').val();

        //Get the dates
        const currentTime = new Date();
        const eventStartTime = new Date(event_Date_Start + 'T' + event_Start);

        if (event_Date_Start > event_Date_End) {
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'You cannot set the date where the event date end is set before the event start date.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_event_Submit').prop('disabled', false);
        }
        else if (event_Start >= event_End) {
            // Check if end time is before or same as start time.
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'The end time cannot be before or the same as the start time on the same day.',
                icon: 'error',
                allowEnterKey: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            });
            $('#edit_event_Submit').prop('disabled', false);
        }
        else {
            const data = {
                event_Type: event_Type,
                event_Name: event_Name,
                event_Description: event_Description,
                event_Date_Start: event_Date_Start,
                event_Date_End: event_Date_End,
                event_Start: event_Start,
                event_End: event_End,
                event_Venue: event_Venue,
            };
        
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editEvent/${event_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#edit_event_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Event Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditEventForm')[0].reset();
                            $('#editEventModal').modal('hide');
                                location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while saving the event. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#edit_event_Submit').prop('disabled', false);
            })
        }
    }
}

foruploadImage = (event_Id) => getEventforUpload(event_Id)

getEventforUpload = (event_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getEventInfo/${event_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const uploadEventdata = result;
            $('#upload_event_Id').val(uploadEventdata.event_Id);
            $('#upload_event_Name').html(uploadEventdata.event_Name);
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

uploadImageEvent = (EventImage, event_Id) => {
    if ($('#UploadImageEventForm')[0]) {
        const form = new FormData($('#UploadImageEventForm')[0])
        $('#upload_image_event_Submit').prop('disabled', true);

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = EventImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('event_Image', pondFiles[i].file)
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0) {
            Swal.fire({
                title: 'Upload Image is empty.',
                text: 'Please upload the event Image first.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#upload_image_event_Submit').prop('disabled', false);
        }
        else {
            notyf.open({
                message: 'Uploading Image. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'POST',
                url: `/api/admin/uploadEventImage/${event_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    $('#upload_image_event_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Upload Image Event Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#UploadImageEventForm')[0].reset();
                        $('#uploadImageEventModal').modal('hide');
                            location.reload()
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while uploading the image in the event. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#upload_image_event_Submit').prop('disabled', false);
            })
        }
    }
}

deleteImageEvent = (event_Id) => {

    Swal.fire({
        title: 'Delete Image Event',
        html: 'Are you sure do you want to delete the image of this event?',
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
                url: `/api/admin/deleteEventImage/${event_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Event Image Successfully',
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
                    text: 'Something went wrong while deleting event image. Please try again.',
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