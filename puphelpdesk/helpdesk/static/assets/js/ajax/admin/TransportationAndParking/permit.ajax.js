$(function() {
    $('#AddPermitForm').on('submit', function (e) {
        addPermit()
        e.preventDefault() // prevent page refresh
    })
    getPermit();
    $('#EditPermitForm').on('submit', function (e) {
        editPermit()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addPermit = () => {
    if ($('#AddPermitForm')[0].checkValidity()) {
        const form = new FormData($('#AddPermitForm')[0]);
        
        const permit_Title = $('#permit_Title').val();
        const permit_Info = $('#permit_Info').val();
        const permit_Guide = $('#permit_Guide').val();

        const data = {
            permit_Title: permit_Title,
            permit_Info: permit_Info,
            permit_Guide: permit_Guide,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addPermit',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#permit_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Permit Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddPermitForm')[0].reset();
                        $('#AddPermitModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding parking permit. Please try again.',
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

getPermit = () => {
    let permit_display = $('#permit_display')

    notyf.open({
        message: 'Fetching Parking Permit',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getPermit',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const permitdata = result;
            if (permitdata.length > 0) {
                permitdata.forEach((permitdata) => {

                    let permitformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${permitdata.permit_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${permitdata.permit_Info}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#permitInfoModal" onclick="getPermitInfo('${permitdata.permit_Id}')">Information</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditPermitModal" onclick="foreditpermit('${permitdata.permit_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deletePermit('${permitdata.permit_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_permit').html(null)
                        permit_display.append(permitformat)
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

getPermitInfo = (permit_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getPermitInfo/${permit_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const permitdata = result;

            $('#permit_Title_info').html(permitdata.permit_Title);
            $('#permit_Info_info').html(permitdata.permit_Info);
            $('#permit_Guide_info').html(permitdata.permit_Guide);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Permit Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditpermit = (permit_Id) => getPermitforEdit(permit_Id)

getPermitforEdit = (permit_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getPermitInfo/${permit_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const permitData = result;
            $('#edit_permit_Id').val(permitData.permit_Id);
            $('#edit_permit_Title').val(permitData.permit_Title);
            $('#edit_permit_Info').val(permitData.permit_Info);
            $('#edit_permit_Guide').val(permitData.permit_Guide);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Permit Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editPermit = (permit_Id) => {
    if ($('#EditPermitForm')[0].checkValidity()) {
        const form = new FormData($('#EditPermitForm')[0]);
        
        const permit_Id = $('#edit_permit_Id').val();
        const permit_Title = $('#edit_permit_Title').val();
        const permit_Info = $('#edit_permit_Info').val();
        const permit_Guide = $('#edit_permit_Guide').val();

        const data = {
            permit_Title: permit_Title,
            permit_Info: permit_Info,
            permit_Guide: permit_Guide,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editPermit/${permit_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_permit_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Permit Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditPermitForm')[0].reset();
                        $('#EditPermitModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving parking permit. Please try again.',
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

deletePermit = (permit_Id) => {

    Swal.fire({
        title: 'Delete Parking Permit',
        html: 'Are you sure do you want to delete this parking permit?',
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
                url: `/api/admin/deletePermit/${permit_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Permit Successfully',
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
                    text: 'Something went wrong while deleting permit. Please try again.',
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