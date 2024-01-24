$(function() {
    $('#AddServiceForm').on('submit', function (e) {
        addService()
        e.preventDefault() // prevent page refresh
    })
    getService();
    $('#EditServiceForm').on('submit', function (e) {
        editService()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

addService = () => {
    if ($('#AddServiceForm')[0].checkValidity()) {
        const form = new FormData($('#AddServiceForm')[0]);
        
        const service_Name = $('#service_Name').val();
        const service_Description = $('#service_Description').val();

        const data = {
            service_Name: service_Name,
            service_Description: service_Description,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addService',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#service_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Service Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddServiceForm')[0].reset();
                        $('#AddServiceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding service. Please try again.',
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

getService = () => {
    let service_display = $('#service_display')

    notyf.open({
        message: 'Fetching Service',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getService',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const servicedata = result;
            if (servicedata.length > 0) {
                servicedata.forEach((servicedata) => {

                    let serviceformat = `
                    <div class="col-xl-4">
                        <div class="card">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${servicedata.service_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${servicedata.service_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditServiceModal" onclick="foreditservice('${servicedata.service_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteService('${servicedata.service_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    service_display.append(serviceformat)

                });
                notyf.success({
                    message: 'Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Display').html("No Service Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditservice = (service_Id) => getServiceforEdit(service_Id)

getServiceforEdit = (service_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getServiceInfo/${service_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const getServiceData = result;
            $('#edit_service_Name').val(getServiceData.service_Name);
            $('#edit_service_Id').val(getServiceData.service_Id);
            $('#edit_service_Description').val(getServiceData.service_Description);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editService = (service_Id) => {
    if ($('#EditServiceForm')[0].checkValidity()) {
        const form = new FormData($('#EditServiceForm')[0]);

        const service_Id = $('#edit_service_Id').val();
        const service_Name = $('#edit_service_Name').val();
        const service_Description = $('#edit_service_Description').val();

        const data = {
            service_Name: service_Name,
            service_Description: service_Description,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editService/${service_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_service_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Service Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditServiceForm')[0].reset();
                        $('#EditServiceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while editing service. Please try again.',
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

deleteService = (service_Id) => {

    Swal.fire({
        title: 'Delete Service',
        html: 'Are you sure do you want to delete this service?',
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
                url: `/api/admin/deleteService/${service_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Service Successfully',
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
                    text: 'Something went wrong while deleting service. Please try again.',
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