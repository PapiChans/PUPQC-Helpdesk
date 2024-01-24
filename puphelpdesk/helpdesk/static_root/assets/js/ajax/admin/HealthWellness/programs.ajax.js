$(function() {
    $('#AddHealthFacilityForm').on('submit', function (e) {
        addHealthFacility()
        e.preventDefault() // prevent page refresh
    })
    getHealthFacility();
    $('#EditHealthFacilityForm').on('submit', function (e) {
        editHealthFacility()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addHealthFacility = () => {
    if ($('#AddHealthFacilityForm')[0].checkValidity()) {
        const form = new FormData($('#AddHealthFacilityForm')[0]);
        
        const health_Facility_Type = $('#health_Facility_Type').val();
        const health_Facility_Name = $('#health_Facility_Name').val();
        const health_Facility_Description = $('#health_Facility_Description').val();
        const health_Facility_Location = $('#health_Facility_Location').val();
        const health_Facility_Contact = $('#health_Facility_Contact').val();

        const data = {
            health_Facility_Type: health_Facility_Type,
            health_Facility_Name: health_Facility_Name,
            health_Facility_Description: health_Facility_Description,
            health_Facility_Location: health_Facility_Location,
            health_Facility_Contact: health_Facility_Contact,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addHealthFacility',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#health_Facility_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Health Facility Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddHealthFacilityForm')[0].reset();
                        $('#AddHealthFacilityModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Health Facility. Please try again.',
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

getHealthFacility = () => {
    let healthservice_display = $('#healthservice_display')
    let medicalclinic_display = $('#medicalclinic_display')
    let wellnessprograms_display = $('#wellnessprograms_display')

    notyf.open({
        message: 'Fetching Health Facilities',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getHealthFacility',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const facilitydata = result;
            if (facilitydata.length > 0) {
                facilitydata.forEach((facilitydata) => {

                    let facilityformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${facilitydata.health_Facility_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${facilitydata.health_Facility_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#healthfacilityInfoModal" onclick="getHealthFacilityInfo('${facilitydata.health_Facility_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditHealthFacilityModal" onclick="foredithealthfacility('${facilitydata.health_Facility_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteHealthFacility('${facilitydata.health_Facility_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    if (facilitydata.health_Facility_Type == 'Health Service'){
                        $('#no_healthservice').html(null)
                        healthservice_display.append(facilityformat)
                    }
                    if (facilitydata.health_Facility_Type == 'Medical Clinic'){
                        $('#no_medicalclinic').html(null)
                        medicalclinic_display.append(facilityformat)
                    }
                    if (facilitydata.health_Facility_Type == 'Wellness Program'){
                        $('#no_wellnessprograms').html(null)
                        wellnessprograms_display.append(facilityformat)
                    }
                });
                notyf.success({
                    message: 'All Health Facility Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Health Facility Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Facility Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getHealthFacilityInfo = (health_Facility_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHealthFacilityInfo/${health_Facility_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#health_Facility_Type_info').html(healthdata.health_Facility_Type);
            $('#health_Facility_Name_info').html(healthdata.health_Facility_Name);
            $('#health_Facility_Description_info').html(healthdata.health_Facility_Description);
            $('#health_Facility_Location_info').html(healthdata.health_Facility_Location);
            $('#health_Facility_Contact_info').html(healthdata.health_Facility_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Facility Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foredithealthfacility = (health_Facility_Id) => getHealthFacilityforEdit(health_Facility_Id)

getHealthFacilityforEdit = (health_Facility_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHealthFacilityInfo/${health_Facility_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#edit_health_Facility_Id').val(healthdata.health_Facility_Id);
            $('#edit_health_Facility_Type').val(healthdata.health_Facility_Type);
            $('#edit_health_Facility_Name').val(healthdata.health_Facility_Name);
            $('#edit_health_Facility_Description').val(healthdata.health_Facility_Description);
            $('#edit_health_Facility_Location').val(healthdata.health_Facility_Location);
            $('#edit_health_Facility_Contact').val(healthdata.health_Facility_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Facility Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editHealthFacility = (health_Facility_Id) => {
    if ($('#EditHealthFacilityForm')[0].checkValidity()) {
        const form = new FormData($('#EditHealthFacilityForm')[0]);
        
        const health_Facility_Id = $('#edit_health_Facility_Id').val();
        const health_Facility_Type = $('#edit_health_Facility_Type').val();
        const health_Facility_Name = $('#edit_health_Facility_Name').val();
        const health_Facility_Description = $('#edit_health_Facility_Description').val();
        const health_Facility_Location = $('#edit_health_Facility_Location').val();
        const health_Facility_Contact = $('#edit_health_Facility_Contact').val();

        const data = {
            health_Facility_Type: health_Facility_Type,
            health_Facility_Name: health_Facility_Name,
            health_Facility_Description: health_Facility_Description,
            health_Facility_Location: health_Facility_Location,
            health_Facility_Contact: health_Facility_Contact,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editHealthFacility/${health_Facility_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_health_Facility_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Health Facility Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditHealthFacilityForm')[0].reset();
                        $('#EditHealthFacilityModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Health Facility. Please try again.',
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

deleteHealthFacility = (health_Facility_Id) => {

    Swal.fire({
        title: 'Delete Health Facility',
        html: `Are you sure do you want to delete this Health Facility?`,
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
                url: `/api/admin/deleteHealthFacility/${health_Facility_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Health Facility Successfully',
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
                    text: 'Something went wrong while deleting Health Facility. Please try again.',
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