$(function() {
    $('#AddHealthInsuranceForm').on('submit', function (e) {
        addHealthInsurance()
        e.preventDefault() // prevent page refresh
    })
    getHealthInsurance();
    $('#EditHealthInsuranceForm').on('submit', function (e) {
        editHealthInsurance()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addHealthInsurance = () => {
    if ($('#AddHealthInsuranceForm')[0].checkValidity()) {
        const form = new FormData($('#AddHealthInsuranceForm')[0]);
        
        const health_Insurance_Name = $('#health_Insurance_Name').val();
        const health_Insurance_Coverage = $('#health_Insurance_Coverage').val();
        const health_Insurance_Enrollment = $('#health_Insurance_Enrollment').val();
        const health_Insurance_Contact = $('#health_Insurance_Contact').val();

        const data = {
            health_Insurance_Name: health_Insurance_Name,
            health_Insurance_Coverage: health_Insurance_Coverage,
            health_Insurance_Enrollment: health_Insurance_Enrollment,
            health_Insurance_Contact: health_Insurance_Contact,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addHealthInsurance',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#health_Insurance_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Health Insurance Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddHealthInsuranceForm')[0].reset();
                        $('#AddHealthInsuranceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Health Insurance. Please try again.',
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

getHealthInsurance = () => {
    let healthinsurance_display = $('#healthinsurance_display')

    notyf.open({
        message: 'Fetching Health Insurance',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getHealthInsurance',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const insurancedata = result;
            if (insurancedata.length > 0) {
                insurancedata.forEach((insurancedata) => {

                    let insuranceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${insurancedata.health_Insurance_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Contact: <strong>${insurancedata.health_Insurance_Contact}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#healthinsuranceInfoModal" onclick="getHealthInsuranceInfo('${insurancedata.health_Insurance_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditHealthInsuranceModal" onclick="foredithealthinsurance('${insurancedata.health_Insurance_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteHealthInsurance('${insurancedata.health_Insurance_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_HealthInsurance').html(null)
                        healthinsurance_display.append(insuranceformat)
                });
                notyf.success({
                    message: 'All Health Insurance Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Health Insurance Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Insurance Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getHealthInsuranceInfo = (health_Insurance_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHealthInsuranceInfo/${health_Insurance_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#health_Insurance_Name_info').html(healthdata.health_Insurance_Name);
            $('#health_Insurance_Coverage_info').html(healthdata.health_Insurance_Coverage);
            $('#health_Insurance_Enrollment_info').html(healthdata.health_Insurance_Enrollment);
            $('#health_Insurance_Contact_info').html(healthdata.health_Insurance_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Insurance Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foredithealthinsurance = (health_Insurance_Id) => getHealthInsuranceforEdit(health_Insurance_Id)

getHealthInsuranceforEdit = (health_Insurance_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHealthInsuranceInfo/${health_Insurance_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#edit_health_Insurance_Id').val(healthdata.health_Insurance_Id);
            $('#edit_health_Insurance_Name').val(healthdata.health_Insurance_Name);
            $('#edit_health_Insurance_Coverage').val(healthdata.health_Insurance_Coverage);
            $('#edit_health_Insurance_Enrollment').val(healthdata.health_Insurance_Enrollment);
            $('#edit_health_Insurance_Contact').val(healthdata.health_Insurance_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Insurance Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editHealthInsurance = (health_Insurance_Id) => {
    if ($('#EditHealthInsuranceForm')[0].checkValidity()) {
        const form = new FormData($('#EditHealthInsuranceForm')[0]);
        
        const health_Insurance_Id = $('#edit_health_Insurance_Id').val();
        const health_Insurance_Name = $('#edit_health_Insurance_Name').val();
        const health_Insurance_Coverage = $('#edit_health_Insurance_Coverage').val();
        const health_Insurance_Enrollment = $('#edit_health_Insurance_Enrollment').val();
        const health_Insurance_Contact = $('#edit_health_Insurance_Contact').val();

        const data = {
            health_Insurance_Name: health_Insurance_Name,
            health_Insurance_Coverage: health_Insurance_Coverage,
            health_Insurance_Enrollment: health_Insurance_Enrollment,
            health_Insurance_Contact: health_Insurance_Contact,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editHealthInsurance/${health_Insurance_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_health_Insurance_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Health Insurance Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditHealthInsuranceForm')[0].reset();
                        $('#EditHealthInsuranceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Health Insurance. Please try again.',
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

deleteHealthInsurance = (health_Insurance_Id) => {

    Swal.fire({
        title: 'Delete Health Insurance',
        html: `Are you sure do you want to delete this Health Insurance?`,
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
                url: `/api/admin/deleteHealthInsurance/${health_Insurance_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Health Insurance Successfully',
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
                    text: 'Something went wrong while deleting Health Insurance. Please try again.',
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