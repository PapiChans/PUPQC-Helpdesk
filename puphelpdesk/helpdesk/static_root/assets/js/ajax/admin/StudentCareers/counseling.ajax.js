$(function() {
    $('#AddCounselingForm').on('submit', function (e) {
        addCounseling()
        e.preventDefault() // prevent page refresh
    })
    getCounseling();
    $('#EditCounselingForm').on('submit', function (e) {
        editCounseling()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addCounseling = () => {
    if ($('#AddCounselingForm')[0].checkValidity()) {
        const form = new FormData($('#AddCounselingForm')[0]);
        
        const counseling_Name = $('#counseling_Name').val();
        const counseling_Contact = $('#counseling_Contact').val();
        const counseling_Location = $('#counseling_Location').val();
        const counseling_Service = $('#counseling_Service').val();

        const data = {
            counseling_Name: counseling_Name,
            counseling_Contact: counseling_Contact,
            counseling_Location: counseling_Location,
            counseling_Service: counseling_Service,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addCounseling',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#counseling_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Counseling Personnel Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddCounselingForm')[0].reset();
                        $('#AddCounselingModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding career counselor. Please try again.',
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

getCounseling = () => {
    let counseling_display = $('#counseling_display')

    notyf.open({
        message: 'Fetching Career Counselors',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getCounseling',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const careerdata = result;
            if (careerdata.length > 0) {
                careerdata.forEach((careerdata) => {

                    let careerformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${careerdata.counseling_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Service: <strong>${careerdata.counseling_Service}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#counselingInfoModal" onclick="getCounselingInfo('${careerdata.counseling_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditCounselingModal" onclick="foreditcounseling('${careerdata.counseling_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteCounseling('${careerdata.counseling_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Counseling').html(null)
                        counseling_display.append(careerformat)
                });
                notyf.success({
                    message: 'All Career Counselors Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Career Counselors Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Career Counselors Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getCounselingInfo = (counseling_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCounselingInfo/${counseling_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const careerdata = result;
            $('#counseling_Name_info').html(careerdata.counseling_Name);
            $('#counseling_Contact_info').html(careerdata.counseling_Contact);
            $('#counseling_Location_info').html(careerdata.counseling_Location);
            $('#counseling_Service_info').html(careerdata.counseling_Service);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Career Counselor Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditcounseling = (counseling_Id) => getCounselingforEdit(counseling_Id)

getCounselingforEdit = (counseling_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCounselingInfo/${counseling_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const careerdata = result;
            $('#edit_counseling_Id').val(careerdata.counseling_Id);
            $('#edit_counseling_Name').val(careerdata.counseling_Name);
            $('#edit_counseling_Contact').val(careerdata.counseling_Contact);
            $('#edit_counseling_Location').val(careerdata.counseling_Location);
            $('#edit_counseling_Service').val(careerdata.counseling_Service);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Career Counseling Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editCounseling = (counseling_Id) => {
    if ($('#EditCounselingForm')[0].checkValidity()) {
        const form = new FormData($('#EditCounselingForm')[0]);
        
        const counseling_Id = $('#edit_counseling_Id').val();
        const counseling_Name = $('#edit_counseling_Name').val();
        const counseling_Contact = $('#edit_counseling_Contact').val();
        const counseling_Location = $('#edit_counseling_Location').val();
        const counseling_Service = $('#edit_counseling_Service').val();

        const data = {
            counseling_Name: counseling_Name,
            counseling_Contact: counseling_Contact,
            counseling_Location: counseling_Location,
            counseling_Service: counseling_Service,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editCounseling/${counseling_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_counseling_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Counseling Personnel Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditCounselingForm')[0].reset();
                        $('#EditCounselingModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving career counselor. Please try again.',
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

deleteCounseling = (counseling_Id) => {

    Swal.fire({
        title: 'Delete Career Counseling',
        html: `Are you sure do you want to delete this Career Counselor?`,
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
                url: `/api/admin/deleteCounseling/${counseling_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Career Counselor Successfully',
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
                    text: 'Something went wrong while deleting Career Counselor. Please try again.',
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