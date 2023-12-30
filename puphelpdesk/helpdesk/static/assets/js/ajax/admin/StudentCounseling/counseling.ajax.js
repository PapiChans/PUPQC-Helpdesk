$(function() {
    $('#AddCounselorForm').on('submit', function (e) {
        addCounselor()
        e.preventDefault() // prevent page refresh
    })
    getCounselor();
    $('#EditCounselorForm').on('submit', function (e) {
        editCounselor()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addCounselor = () => {
    if ($('#AddCounselorForm')[0].checkValidity()) {
        const form = new FormData($('#AddCounselorForm')[0]);
        
        const counselor_Name = $('#counselor_Name').val();
        const counselor_Contact = $('#counselor_Contact').val();
        const counselor_Specialization = $('#counselor_Specialization').val();
        const counselor_Reach_Out = $('#counselor_Reach_Out').val();

        const data = {
            counselor_Name: counselor_Name,
            counselor_Contact: counselor_Contact,
            counselor_Specialization: counselor_Specialization,
            counselor_Reach_Out: counselor_Reach_Out,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addSupportCounselor',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#counselor_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Support Counselor Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddCounselorForm')[0].reset();
                        $('#AddCounselorModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding support counselor. Please try again.',
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

getCounselor = () => {
    let counselor_display = $('#counselor_display')

    notyf.open({
        message: 'Fetching Support Counselors',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getSupportCounselor',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const counselordata = result;
            if (counselordata.length > 0) {
                counselordata.forEach((counselordata) => {

                    let counselorformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${counselordata.counselor_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Specialization: <strong>${counselordata.counselor_Specialization}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#counselorInfoModal" onclick="getCounselorInfo('${counselordata.counselor_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditCounselorModal" onclick="foreditcounselor('${counselordata.counselor_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteSupportCounselor('${counselordata.counselor_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Counselor').html(null)
                        counselor_display.append(counselorformat)
                });
                notyf.success({
                    message: 'All Support Counselors Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Support Counselors Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Support Counselors Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getCounselorInfo = (counselor_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getSupportCounselorInfo/${counselor_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const counselordata = result;
            $('#counselor_Name_info').html(counselordata.counselor_Name);
            $('#counselor_Contact_info').html(counselordata.counselor_Contact);
            $('#counselor_Specialization_info').html(counselordata.counselor_Specialization);
            $('#counselor_Reach_Out_info').html(counselordata.counselor_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Support Counselor Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditcounselor = (counselor_Id) => getCounselorforEdit(counselor_Id)

getCounselorforEdit = (counselor_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getSupportCounselorInfo/${counselor_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const counselordata = result;
            $('#edit_counselor_Id').val(counselordata.counselor_Id);
            $('#edit_counselor_Name').val(counselordata.counselor_Name);
            $('#edit_counselor_Contact').val(counselordata.counselor_Contact);
            $('#edit_counselor_Specialization').val(counselordata.counselor_Specialization);
            $('#edit_counselor_Reach_Out').val(counselordata.counselor_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Support Counseling Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editCounselor = (counselor_Id) => {
    if ($('#EditCounselorForm')[0].checkValidity()) {
        const form = new FormData($('#EditCounselorForm')[0]);
        
        const counselor_Id = $('#edit_counselor_Id').val();
        const counselor_Name = $('#edit_counselor_Name').val();
        const counselor_Contact = $('#edit_counselor_Contact').val();
        const counselor_Specialization = $('#edit_counselor_Specialization').val();
        const counselor_Reach_Out = $('#edit_counselor_Reach_Out').val();

        const data = {
            counselor_Name: counselor_Name,
            counselor_Contact: counselor_Contact,
            counselor_Specialization: counselor_Specialization,
            counselor_Reach_Out: counselor_Reach_Out,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editSupportCounselor/${counselor_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_counselor_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Support Counselor Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditCounselorForm')[0].reset();
                        $('#EditCounselorModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving support counselor. Please try again.',
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

deleteSupportCounselor = (counselor_Id) => {

    Swal.fire({
        title: 'Delete Career Counseling',
        html: `Are you sure do you want to delete this Support Counselor?`,
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
                url: `/api/admin/deleteSupportCounselor/${counselor_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Support Counselor Successfully',
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
                    text: 'Something went wrong while deleting Support Counselor. Please try again.',
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