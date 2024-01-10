$(function() {
    getRoute();
});

const notyf = new Notyf();

getRoute = () => {
    let driving_display = $('#driving_display')
    let two_wheeler_display = $('#two_wheeler_display')
    let transit_display = $('#transit_display')
    let walking_display= $('#walking_display')
    let cycling_display = $('#cycling_display')

    notyf.open({
        message: 'Fetching Transportation Data',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getTransport',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const transportdata = result;
            if (transportdata.length > 0) {
                transportdata.forEach((transportdata) => {

                    let transportformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">${transportdata.transport_Route} [${transportdata.transport_Distance}]</h3>
                            <p>${transportdata.transport_Info}</p>
                        </div>
                        <div class="card-footer">
                        <button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#transportInfoModal" onclick="getRouteInfo('${transportdata.transport_Id}')">Information</button>
                        </div>
                    </div>
                        `;

                        if(transportdata.transport_Type == 'Driving'){
                            $('#no_driving').html(null)
                            driving_display.append(transportformat)
                        }
                        else if(transportdata.transport_Type == 'Two Wheeler'){
                            $('#no_two_wheeler').html(null)
                            two_wheeler_display.append(transportformat)
                        }
                        else if(transportdata.transport_Type == 'Transit'){
                            $('#no_transit').html(null)
                            transit_display.append(transportformat)
                        }
                        else if(transportdata.transport_Type == 'Walking'){
                            $('#no_walking').html(null)
                            walking_display.append(transportformat)
                        }
                        else if(transportdata.transport_Type == 'Cycling'){
                            $('#no_cycling').html(null)
                            cycling_display.append(transportformat)
                        }
                });
                notyf.success({
                    message: 'All Parking Permit Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Parking Permit Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Parking Permit Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getRouteInfo = (transport_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getTransportInfo/${transport_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const transportdata = result;

            $('#transport_Type_info').html(transportdata.transport_Type);
            $('#transport_Route_info').html(transportdata.transport_Route);
            $('#transport_Distance_info').html(transportdata.transport_Distance);
            $('#transport_Fare_info').html(transportdata.transport_Fare);
            $('#transport_Info_info').html(transportdata.transport_Info);
            $('#transport_Time_info').html(transportdata.transport_Time);
            $('#transport_Schedule_info').html(transportdata.transport_Schedule);
            
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Transport Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}