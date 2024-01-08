$(function() {
    $('#AddRegulationForm').on('submit', function (e) {
        addRegulation()
        e.preventDefault() // prevent page refresh
    })
    getRegulation();
    $('#EditRegulationForm').on('submit', function (e) {
        editRegulation()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addRegulation = () => {
    if ($('#AddRegulationForm')[0].checkValidity()) {
        const form = new FormData($('#AddRegulationForm')[0]);
        
        const regulation_Title = $('#regulation_Title').val();
        const regulation_Info = $('#regulation_Info').val();

        const data = {
            regulation_Title: regulation_Title,
            regulation_Info: regulation_Info,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addRegulation',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#regulation_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Regulation Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddRegulationForm')[0].reset();
                        $('#AddRegulationModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding parking regulation. Please try again.',
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

getRegulation = () => {
    let regulation_display = $('#regulation_display')

    notyf.open({
        message: 'Fetching Parking Regulation',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getRegulation',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const regulationdata = result;
            if (regulationdata.length > 0) {
                regulationdata.forEach((regulationdata) => {

                    let regulationformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">${regulationdata.regulation_Title}</h3>
                            <p>${regulationdata.regulation_Info}</p>
                        </div>
                        <div class="card-footer">
                        <button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditRegulationModal" onclick="foreditregulation('${regulationdata.regulation_Id}')">Edit</button>
                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteRegulation('${regulationdata.regulation_Id}')">Delete</button>
                        </div>
                    </div>
                        `;

                        $('#no_regulation').html(null)
                        regulation_display.append(regulationformat)
                });
                notyf.success({
                    message: 'All Parking Regulation Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Parking Regulation Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Parking Regulation Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditregulation = (regulation_Id) => getRegulationforEdit(regulation_Id)

getRegulationforEdit = (regulation_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getRegulationInfo/${regulation_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const regulationData = result;
            $('#edit_regulation_Id').val(regulationData.regulation_Id);
            $('#edit_regulation_Title').val(regulationData.regulation_Title);
            $('#edit_regulation_Info').val(regulationData.regulation_Info);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Regulation Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editRegulation = (regulation_Id) => {
    if ($('#EditRegulationForm')[0].checkValidity()) {
        const form = new FormData($('#EditRegulationForm')[0]);
        
        const regulation_Id = $('#edit_regulation_Id').val();
        const regulation_Title = $('#edit_regulation_Title').val();
        const regulation_Info = $('#edit_regulation_Info').val();

        const data = {
            regulation_Title: regulation_Title,
            regulation_Info: regulation_Info,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editRegulation/${regulation_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_regulation_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Regulation Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditRegulationForm')[0].reset();
                        $('#EditRegulationModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving parking regulation. Please try again.',
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

deleteRegulation = (regulation_Id) => {

    Swal.fire({
        title: 'Delete Parking Regulation',
        html: 'Are you sure do you want to delete this parking regulation?',
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
                url: `/api/admin/deleteRegulation/${regulation_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Regulation Successfully',
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
                    text: 'Something went wrong while deleting regulation. Please try again.',
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