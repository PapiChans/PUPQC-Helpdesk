$(function() {
    $('#AddEventForm').on('submit', function (e) {
        addEvent()
        e.preventDefault() // prevent page refresh
    })
    getEvent();
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

const inputElement = document.querySelector('#event_Image');
FilePond.registerPlugin(FilePondPluginFileValidateType);
// Create a FilePond instance
const pond = FilePond.create(inputElement)


addEvent = () => {

    if ($('#AddEventForm')[0].checkValidity()) {
        const form = new FormData($('#AddEventForm')[0]);
        const event_Name = $('#event_Name').val();
        const event_Description = $('#event_Description').val();
        const event_Date_Start = $('#event_Date_Start').val();
        const event_Date_End = $('#event_Date_End').val();
        const event_Start = $('#event_Start').val();
        const event_End = $('#event_End').val();

        const data = {
            event_Name: event_Name,
            event_Description: event_Description,
            event_Date_Start: event_Date_Start,
            event_Date_End: event_Date_End,
            event_Start: event_Start,
            event_End: event_End,
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
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
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
        })
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

    notyf.open({
        message: 'Fetching Events',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getEvent',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const eventdata = result;

            let showeventImage = result.event_Image == !null;
            if (eventdata.length > 0) {
                eventdata.forEach((eventdata) => {
                    const formattedStartdate = formatDate(eventdata.event_Date_Start);
                    const formattedEnddate = formatDate(eventdata.event_Date_End);
                    const formattedStarttime = convertTo12HourFormat(eventdata.event_Start)
                    const formattedEndtime = convertTo12HourFormat(eventdata.event_End)

                    const currentDate = new Date();
                    const formattedCurrentdate = formatDateToYYYYMMDD(currentDate);

                    let eventformat = `
                        <div class="col-xl-4">
                            <div class="card">
                                <img class="card-img-top img-fluid" src="${showeventImage ? `` : `/static/assets/images/image-not-found/default-image-404.png`}">
                                <div class="card-body">
                                    <h4 class="card-title font-size-16 mt-0 text-center" contenteditable="false" id="title-1">${eventdata.event_Name}</h4>
                                    <p class="card-text" contenteditable="false">Event Date: ${formattedStartdate} - ${formattedEnddate}</p>
                                    <p class="card-text" contenteditable="false">Event Time: ${formattedStarttime} - ${formattedEndtime}</p>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-info waves-effect waves-light">Edit</button>
                                        <button type="button" class="btn btn-danger waves-effect waves-light">Delete</button>
                                        <button type="button" class="btn btn-info waves-effect waves-light" data-toggle="modal" data-target="#eventInfoModal" onclick="getEventInfo('${eventdata.event_Id}')"><i class="fa-solid fa-circle-info"></i> Information</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;

                        if (eventdata.event_Date_Start === formattedCurrentdate){
                            $('#no_ongoing').html(null)
                            ongoing_display.append(eventformat);
                        }
                        if (eventdata.event_Date_Start > formattedCurrentdate ){
                            $('#no_upcoming').html(null)
                            upcoming_display.append(eventformat);
                        }
                        if (eventdata.event_Date_Start < formattedCurrentdate && eventdata.event_Date_End < formattedCurrentdate ){
                            $('#no_ended').html(null)
                            ended_display.append(eventformat);
                        }
                });
                notyf.success({
                    message: 'All Events Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
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
            $('#event_desc_info').html(eventInfodata.event_Description);
            $('#event_date_info').html(fordate);
            $('#event_time_info').html(fortime);
            if (eventInfodata.event_Image != null){
                $('#event_image_info').attr('src', eventInfodata.event_Image)
            }
            else {
                $('#event_image_info').attr('src', '/static/assets/images/image-not-found/default-image-404.png')
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