$(function () {
    getCharter();
})

const notyf = new Notyf();

function getCharterInfoAndNavigate(charterId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/student/charters/details?charter_number=${charterId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}


getCharter = () => {
    let charter_display = $('#charter_display')
    let charter_Category = 'Medical Services'

    $.ajax({
        type: 'GET',
        url: `/api/student/getCharter/${charter_Category}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${data.charter_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${data.charter_Description.replace(/\n/g, '</p><p>')}</p>
                                <div class="text-center">
                                <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getCharterInfoAndNavigate('${data.charter_Number}')">View</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    charter_display.append(charterformat)

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Charter').html("No Charter Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditcharter = (charter_Id) => getCharterforEdit(charter_Id)

getCharterforEdit = (charter_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharterInfo/${charter_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#edit_charter_Id').val(data.charter_Id);
            $('#edit_charter_Title').val(data.charter_Title);
            $('#edit_charter_Description').val(data.charter_Description);
            $('#edit_charter_Category').val(data.charter_Category);
            $('#edit_charter_Office').val(data.charter_Office);
            $('#edit_charter_Classification').val(data.charter_Classification);
            $('#edit_charter_Transaction').val(data.charter_Transaction);
            $('#edit_charter_Avail').val(data.charter_Avail);
            $('#edit_charter_Requirements').val(data.charter_Requirements);
            $('#edit_charter_Secure').val(data.charter_Secure);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editCharter = (charter_Id) => {
    if ($('#EditCharterForm')[0].checkValidity()) {
        const form = new FormData($('#EditCharterForm')[0]);

        $('#edit_charter_Submit').prop('disabled', true);

        const charter_Id = $('#edit_charter_Id').val();
        const charter_Category = $('#edit_charter_Category').val();
        const charter_Title = $('#edit_charter_Title').val();
        const charter_Description = $('#edit_charter_Description').val();
        const charter_Office = $('#edit_charter_Office').val();
        const charter_Classification = $('#edit_charter_Classification').val();
        const charter_Transaction = $('#edit_charter_Transaction').val();
        const charter_Avail = $('#edit_charter_Avail').val();
        const charter_Requirements = $('#edit_charter_Requirements').val();
        const charter_Secure = $('#edit_charter_Secure').val();

        const data = {
            charter_Category: charter_Category,
            charter_Title: charter_Title,
            charter_Description: charter_Description,
            charter_Office: charter_Office,
            charter_Classification: charter_Classification,
            charter_Transaction: charter_Transaction,
            charter_Avail: charter_Avail,
            charter_Requirements: charter_Requirements,
            charter_Secure: charter_Secure,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editCharter/${charter_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_charter_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Charter Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditCharterForm')[0].reset();
                        $('#EditCharterModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while editing charter. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_charter_Submit').prop('disabled', false);
        })
    }
}

deleteCharter = (charter_Id) => {

    Swal.fire({
        title: 'Delete Charter',
        html: 'Are you sure do you want to delete this Charter?',
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
                url: `/api/admin/deleteCharter/${charter_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Charter Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting charter. Please try again.',
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