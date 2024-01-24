$(function() {
    $('#AddAdviserForm').on('submit', function (e) {
        addAdviser()
        e.preventDefault() // prevent page refresh
    })
    getAdviser();
    $('#EditAdviserForm').on('submit', function (e) {
        editAdviser()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addAdviser = () => {
    if ($('#AddAdviserForm')[0].checkValidity()) {
        const form = new FormData($('#AddAdviserForm')[0]);
        
        const adviser_Name = $('#adviser_Name').val();
        const adviser_Contact = $('#adviser_Contact').val();
        const adviser_Specialization = $('#adviser_Specialization').val();
        const adviser_Reach_Out = $('#adviser_Reach_Out').val();

        const data = {
            adviser_Name: adviser_Name,
            adviser_Contact: adviser_Contact,
            adviser_Specialization: adviser_Specialization,
            adviser_Reach_Out: adviser_Reach_Out,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addAcademicAdviser',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#adviser_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Academic Adviser Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddAdviserForm')[0].reset();
                        $('#AddAdviserModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding academic Adviser. Please try again.',
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

getAdviser = () => {
    let adviser_display = $('#adviser_display')

    notyf.open({
        message: 'Fetching Academic Adviser',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getAcademicAdviser',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const adviserdata = result;
            if (adviserdata.length > 0) {
                adviserdata.forEach((adviserdata) => {

                    let adviserformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${adviserdata.adviser_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Specialization: <strong>${adviserdata.adviser_Specialization}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#adviserInfoModal" onclick="getAcademicAdviserInfo('${adviserdata.adviser_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditAdviserModal" onclick="foreditadviser('${adviserdata.adviser_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteAcademicAdviser('${adviserdata.adviser_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Adviser').html(null)
                        adviser_display.append(adviserformat)
                });
                notyf.success({
                    message: 'All Academic Adviser Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Academic Adviser Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Academic Adviser Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getAcademicAdviserInfo = (adviser_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getAcademicAdviserInfo/${adviser_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const adviserdata = result;
            $('#adviser_Name_info').html(adviserdata.adviser_Name);
            $('#adviser_Contact_info').html(adviserdata.adviser_Contact);
            $('#adviser_Specialization_info').html(adviserdata.adviser_Specialization);
            $('#adviser_Reach_Out_info').html(adviserdata.adviser_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Academic Adviser Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditadviser = (adviser_Id) => getAdviserforEdit(adviser_Id)

getAdviserforEdit = (adviser_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getAcademicAdviserInfo/${adviser_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const adviserdata = result;
            $('#edit_adviser_Id').val(adviserdata.adviser_Id);
            $('#edit_adviser_Name').val(adviserdata.adviser_Name);
            $('#edit_adviser_Contact').val(adviserdata.adviser_Contact);
            $('#edit_adviser_Specialization').val(adviserdata.adviser_Specialization);
            $('#edit_adviser_Reach_Out').val(adviserdata.adviser_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Academic Adviser Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editAdviser = (adviser_Id) => {
    if ($('#EditAdviserForm')[0].checkValidity()) {
        const form = new FormData($('#EditAdviserForm')[0]);
        
        const adviser_Id = $('#edit_adviser_Id').val();
        const adviser_Name = $('#edit_adviser_Name').val();
        const adviser_Contact = $('#edit_adviser_Contact').val();
        const adviser_Specialization = $('#edit_adviser_Specialization').val();
        const adviser_Reach_Out = $('#edit_adviser_Reach_Out').val();

        const data = {
            adviser_Name: adviser_Name,
            adviser_Contact: adviser_Contact,
            adviser_Specialization: adviser_Specialization,
            adviser_Reach_Out: adviser_Reach_Out,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editAcademicAdviser/${adviser_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_adviser_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Academic Adviser Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditAdviserForm')[0].reset();
                        $('#EditAdviserModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving academic Adviser. Please try again.',
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

deleteAcademicAdviser = (adviser_Id) => {

    Swal.fire({
        title: 'Delete Academic Adviser',
        html: `Are you sure do you want to delete this Academic Adviser?`,
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
                url: `/api/admin/deleteAcademicAdviser/${adviser_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Academic Adviser Successfully',
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
                    text: 'Something went wrong while deleting Academic Adviser. Please try again.',
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