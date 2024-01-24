$(function() {
    $('#AddStepForm').on('submit', function (e) {
        addObtainingGuide()
        e.preventDefault() // prevent page refresh
    })
    getObtaining();
    $('#EditStepForm').on('submit', function (e) {
        editStepGuide()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

$('input#guide_Step_Number').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

$('input#edit_guide_Step_Number').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use a regular expression to check if the value is a number
    return /^[0-9]+$/.test(value);
}

addObtainingGuide = () => {
    if ($('#AddStepForm')[0].checkValidity()) {
        const form = new FormData($('#AddStepForm')[0]);
        
        const guide_Step_Number = $('#guide_Step_Number').val();
        const guide_Title = $('#guide_Title').val();
        const guide_Text = $('#guide_Text').val();

        if (!isValidNumber(guide_Step_Number)){
            Swal.fire({
                title: 'Something went wrong',
                text: 'Step Number field must enter numbers only.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }

        else {

            const data = {
                guide_Step_Number: guide_Step_Number,
                guide_Title: guide_Title,
                guide_Text: guide_Text,
            };
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addObtainingStep',
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#guide_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Guide Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#AddStepForm')[0].reset();
                            $('#AddStepModal').modal('hide');
                            setTimeout(function () {
                                location.reload()
                            }, 2600);
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding guide step. Please try again.',
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
}

getObtaining = () => {
    let obtaining_display = $('#obtaining_display')

    notyf.open({
        message: 'Fetching Guide Steps',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getObtainingStep',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const guidedata = result;
            if (guidedata.length > 0) {
                guidedata.forEach((guidedata) => {

                    let guideformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">Step ${guidedata.guide_Step_Number}: ${guidedata.guide_Title}</h3>
                            <p>${guidedata.guide_Text}</p>
                        </div>
                        <div class="card-footer">
                        <button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditStepModal" onclick="foreditstep('${guidedata.guide_Id}')">Edit Step</button>
                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteGuide('${guidedata.guide_Id}')">Delete</button>
                        </div>
                    </div>
                    `;

                    obtaining_display.append(guideformat)

                });
                notyf.success({
                    message: 'Guide Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no-step').html(null);
            }
            else {
                notyf.success({
                    message: 'No Guide Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
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

foreditstep = (guide_Id) => getStepforEdit(guide_Id)

getStepforEdit = (guide_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getStepInfo/${guide_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const editGuidedata = result;
            $('#edit_guide_Id').val(editGuidedata.guide_Id);
            $('#edit_guide_Step_Number').val(editGuidedata.guide_Step_Number);
            $('#edit_guide_Title').val(editGuidedata.guide_Title);
            $('#edit_guide_Text').val(editGuidedata.guide_Text);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Step Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editStepGuide = (guide_Id) => {
    if ($('#EditStepForm')[0].checkValidity()) {
        const form = new FormData($('#EditStepForm')[0]);
        
        const guide_Id = $('#edit_guide_Id').val();
        const guide_Step_Number = $('#edit_guide_Step_Number').val();
        const guide_Title = $('#edit_guide_Title').val();
        const guide_Text = $('#edit_guide_Text').val();

        if (!isValidNumber(guide_Step_Number)){
            Swal.fire({
                title: 'Something went wrong',
                text: 'Step Number field must enter numbers only.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }

        else {

            const data = {
                guide_Step_Number: guide_Step_Number,
                guide_Title: guide_Title,
                guide_Text: guide_Text,
            };
            
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editGuideStep/${guide_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#edit_guide_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Guide Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditStepForm')[0].reset();
                            $('#EditStepModal').modal('hide');
                            setTimeout(function () {
                                location.reload()
                            }, 2600);
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while saving guide step. Please try again.',
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
}

deleteGuide = (guide_Id) => {

    Swal.fire({
        title: 'Delete Guide Step',
        html: 'Are you sure do you want to delete this guide step?',
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
                url: `/api/admin/deleteGuideStep/${guide_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Guide Step Successfully',
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
                    text: 'Something went wrong while deleting guide step. Please try again.',
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