$(function() {
    $('#AddGovernmentForm').on('submit', function (e) {
        addGovernment()
        e.preventDefault() // prevent page refresh
    })
    getStudentGovernment();
    $('#EditGovernmentForm').on('submit', function (e) {
        editGovernment()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addGovernment = () => {
    if ($('#AddGovernmentForm')[0].checkValidity()) {
        const form = new FormData($('#AddGovernmentForm')[0]);
        
        const government_Type = $('#government_Type').val();
        const government_Title = $('#government_Title').val();
        const government_Name = $('#government_Name').val();
        const government_Role = $('#government_Role').val();
        const government_Description = $('#government_Description').val();
        const government_Qualification = $('#government_Qualification').val();
        const government_Participation = $('#government_Participation').val();

        const data = {
            government_Type: government_Type,
            government_Title: government_Title,
            government_Name: government_Name,
            government_Role: government_Role,
            government_Description: government_Description,
            government_Qualification: government_Qualification,
            government_Participation: government_Participation,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addGovernment',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#government_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Student Government Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddGovernmentForm')[0].reset();
                        $('#AddGovernmentModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Student Government. Please try again.',
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

getStudentGovernment = () => {
    let election_display = $('#election_display')
    let membership_display = $('#membership_display')

    notyf.open({
        message: 'Fetching Student Referrals',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getGovernment',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const governmentdata = result;
            if (governmentdata.length > 0) {
                governmentdata.forEach((governmentdata) => {

                    let governmentformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${governmentdata.government_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Organization: <strong>${governmentdata.government_Name}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#governmentInfoModal" onclick="getGovernmentInfo('${governmentdata.government_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditGovernmentModal" onclick="foreditGovernment('${governmentdata.government_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteStudentGovernment('${governmentdata.government_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    if (governmentdata.government_Type == 'Election'){
                        $('#no_election').html(null)
                        election_display.append(governmentformat)
                    }
                    if (governmentdata.government_Type == 'Membership'){
                        $('#no_membership').html(null)
                        membership_display.append(governmentformat)
                    }
                });
                notyf.success({
                    message: 'All Student Government Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Student Government  Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Student Government  Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getGovernmentInfo = (government_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getGovernmentInfo/${government_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const governmentdata = result;
            $('#government_Type_info').html(governmentdata.government_Type);
            $('#government_Title_info').html(governmentdata.government_Title);
            $('#government_Name_info').html(governmentdata.government_Name);
            $('#government_Role_info').html(governmentdata.government_Role);
            $('#government_Description_info').html(governmentdata.government_Description);
            $('#government_Qualification_info').html(governmentdata.government_Qualification);
            $('#government_Participation_info').html(governmentdata.government_Participation);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Student Government Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditGovernment = (government_Id) => getGovernmentforEdit(government_Id)

getGovernmentforEdit = (government_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getGovernmentInfo/${government_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const governmentdata = result;
            $('#edit_government_Id').val(governmentdata.government_Id);
            $('#edit_government_Type').val(governmentdata.government_Type);
            $('#edit_government_Title').val(governmentdata.government_Title);
            $('#edit_government_Name').val(governmentdata.government_Name);
            $('#edit_government_Role').val(governmentdata.government_Role);
            $('#edit_government_Description').val(governmentdata.government_Description);
            $('#edit_government_Qualification').val(governmentdata.government_Qualification);
            $('#edit_government_Participation').val(governmentdata.government_Participation);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Student Government Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editGovernment = (government_Id) => {
    if ($('#EditGovernmentForm')[0].checkValidity()) {
        const form = new FormData($('#EditGovernmentForm')[0]);
        
        const government_Id = $('#edit_government_Id').val();
        const government_Type = $('#edit_government_Type').val();
        const government_Title = $('#edit_government_Title').val();
        const government_Name = $('#edit_government_Name').val();
        const government_Role = $('#edit_government_Role').val();
        const government_Description = $('#edit_government_Description').val();
        const government_Qualification = $('#edit_government_Qualification').val();
        const government_Participation = $('#edit_government_Participation').val();

        const data = {
            government_Type: government_Type,
            government_Title: government_Title,
            government_Name: government_Name,
            government_Role: government_Role,
            government_Description: government_Description,
            government_Qualification: government_Qualification,
            government_Participation: government_Participation,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editGovernment/${government_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#government_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Student Government Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditGovernmentForm')[0].reset();
                        $('#EditGovernmentModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Student Government. Please try again.',
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

deleteStudentGovernment = (government_Id) => {

    Swal.fire({
        title: 'Delete Student Government',
        html: `Are you sure do you want to delete this Student Government?`,
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
                url: `/api/admin/deleteGovernment/${government_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Student Governmet Successfully',
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
                    text: 'Something went wrong while deleting Student Government. Please try again.',
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