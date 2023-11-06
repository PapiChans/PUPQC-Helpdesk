$(function() {
    getEvent();
})

const notyf = new Notyf();

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
        url: '/api/student/getEvent',
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

                    let ongoing_img = '/static/assets/images/default-image/ongoing-event.png'
                    let upcoming_img = '/static/assets/images/default-image/upcoming-event.png'
                    let ended_img = '/static/assets/images/default-image/ended-event.png'
                    let imgShow;

                    if (eventdata.event_Date_Start <= formattedCurrentdate && eventdata.event_Date_End >= formattedCurrentdate) {
                        imgShow = ongoing_img;
                    }
                    
                    if (eventdata.event_Date_Start > formattedCurrentdate) {
                        imgShow = upcoming_img;
                    }
                    
                    if (eventdata.event_Date_End < formattedCurrentdate) {
                        imgShow = ended_img;
                    }

                    let eventformat = `
                        <div class="col-xl-4">
                            <div class="card">
                                <img src="${imgShow}" class="card-img-top img-fluid" id="image_thumbnail">
                                <div class="card-body">
                                    <h4 class="card-title font-size-16 mt-0 text-center" contenteditable="false" id="title-1">${eventdata.event_Name}</h4>
                                    <p class="card-text" contenteditable="false">Event Date: ${formattedStartdate} - ${formattedEnddate}</p>
                                    <p class="card-text" contenteditable="false">Event Time: ${formattedStarttime} - ${formattedEndtime}</p>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-info waves-effect waves-light" data-toggle="modal" data-target="#eventInfoModal" onclick="getEventInfo('${eventdata.event_Id}')"><i class="fa-solid fa-circle-info"></i> Information</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;

                        if (eventdata.event_Date_Start <= formattedCurrentdate && eventdata.event_Date_End >= formattedCurrentdate) {
                            $('#no_ongoing').html(null);
                            ongoing_display.append(eventformat)
                        }
                        
                        if (eventdata.event_Date_Start > formattedCurrentdate) {
                            $('#no_upcoming').html(null);
                            upcoming_display.append(eventformat);
                        }
                        
                        if (eventdata.event_Date_End < formattedCurrentdate) {
                            $('#no_ended').html(null);
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
        url: `/api/student/getEventInfo/${event_Id}`,
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
                $('#event_image_info').attr('src', `${eventInfodata.event_Image}`)
            }
            else {
                $('#event_image_info').attr('src', '/static/assets/images/default-image/default-image-404.png')
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