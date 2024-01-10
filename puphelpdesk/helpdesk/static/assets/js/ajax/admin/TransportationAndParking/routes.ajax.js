$(function() {
    $('#AddRouteForm').on('submit', function (e) {
        addRoute()
        e.preventDefault() // prevent page refresh
    })
    getRoute();
    $('#EditRouteForm').on('submit', function (e) {
        editRoute()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addRoute = () => {
    if ($('#AddRouteForm')[0].checkValidity()) {
        const form = new FormData($('#AddRouteForm')[0]);
        
        const transport_Type = $('#transport_Type').val();
        const transport_Route = $('#transport_Route').val();
        const transport_Distance = $('#transport_Distance').val();
        const transport_Fare = $('#transport_Fare').val();
        const transport_Info = $('#transport_Info').val();
        const transport_Time = $('#transport_Time').val();
        const transport_Schedule = $('#transport_Schedule').val();

        const data = {
            transport_Type: transport_Type,
            transport_Route: transport_Route,
            transport_Distance: transport_Distance,
            transport_Fare: transport_Fare,
            transport_Info: transport_Info,
            transport_Time: transport_Time,
            transport_Schedule: transport_Schedule,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addTransport',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#transport_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Route Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddRouteForm')[0].reset();
                        $('#AddRouteModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding route. Please try again.',
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
        url: '/api/admin/getTransport',
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
                        <button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditRouteModal" onclick="foreditroute('${transportdata.transport_Id}')">Edit Step</button>
                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteRoute('${transportdata.transport_Id}')">Delete</button>
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
        url: `/api/admin/getTransportInfo/${transport_Id}`,
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

foreditroute = (transport_Id) => getRouteforEdit(transport_Id)

getRouteforEdit = (transport_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getTransportInfo/${transport_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const transportdata = result;
            $('#edit_transport_Id').val(transportdata.transport_Id);
            $('#edit_transport_Type').val(transportdata.transport_Type);
            $('#edit_transport_Route').val(transportdata.transport_Route);
            $('#edit_transport_Distance').val(transportdata.transport_Distance);
            $('#edit_transport_Fare').val(transportdata.transport_Fare);
            $('#edit_transport_Info').val(transportdata.transport_Info);
            $('#edit_transport_Time').val(transportdata.transport_Time);
            $('#edit_transport_Schedule').val(transportdata.transport_Schedule);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Route Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editRoute = () => {
    if ($('#EditRouteForm')[0].checkValidity()) {
        const form = new FormData($('#EditRouteForm')[0]);
        
        const transport_Id = $('#edit_transport_Id').val();
        const transport_Type = $('#edit_transport_Type').val();
        const transport_Route = $('#edit_transport_Route').val();
        const transport_Distance = $('#edit_transport_Distance').val();
        const transport_Fare = $('#edit_transport_Fare').val();
        const transport_Info = $('#edit_transport_Info').val();
        const transport_Time = $('#edit_transport_Time').val();
        const transport_Schedule = $('#edit_transport_Schedule').val();

        const data = {
            transport_Type: transport_Type,
            transport_Route: transport_Route,
            transport_Distance: transport_Distance,
            transport_Fare: transport_Fare,
            transport_Info: transport_Info,
            transport_Time: transport_Time,
            transport_Schedule: transport_Schedule,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editTransport/${transport_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_transport_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Route Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditRouteForm')[0].reset();
                        $('#EditRouteModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving route. Please try again.',
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

deleteRoute = (transport_Id) => {

    Swal.fire({
        title: 'Delete Transport Route',
        html: 'Are you sure do you want to delete this transport route?',
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
                url: `/api/admin/deleteTransport/${transport_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Transport Successfully',
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
                    text: 'Something went wrong while deleting transport route. Please try again.',
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