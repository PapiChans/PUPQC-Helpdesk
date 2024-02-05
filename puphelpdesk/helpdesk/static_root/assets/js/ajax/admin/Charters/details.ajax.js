$(function () {
    $('#AddStepForm').on('submit', function (e) {
        addCharterStep()
        e.preventDefault() // prevent page refresh
    })
    $('#EditStepForm').on('submit', function (e) {
        editCharterStep()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

function getNumberFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('charter_number');
}

$(document).ready(function () {
    const number = getNumberFromURL();
    if (number) {
        getCharterInfo(number);
    } else {
        console.error('Charter Number not found in the URL');
    }
});

getCharterInfo = (charter_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharterNumberInfo/${charter_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            $('#charter_Id').val(data.charter_Id);

            getCharterStep(data.charter_Id)

            $('#charter_Title_info').html(data.charter_Title);
            $('#charter_Description_info').html(data.charter_Description.replace(/\n/g, '</p><p>'));
            $('#charter_Office_info').html(data.charter_Office);
            $('#charter_Classification_info').html(data.charter_Classification);
            $('#charter_Transaction_info').html(data.charter_Transaction);
            $('#charter_Avail_info').html(data.charter_Avail);
            $('#charter_Requirements_info').html(data.charter_Requirements.replace(/\n/g, '</p><p>'));
            $('#charter_Secure_info').html(data.charter_Secure.replace(/\n/g, '</p><p>'));
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

addCharterStep = () => {
    if ($('#AddStepForm')[0].checkValidity()) {
        const form = new FormData($('#AddStepForm')[0]);

        $('#step_Submit').prop('disabled', true);
        
        const charter_Id = $('#charter_Id').val();
        const step_Client = $('#step_Client').val();
        const step_Agency = $('#step_Agency').val();
        const step_Fees = $('#step_Fees').val();
        const step_Time = $('#step_Time').val();
        const step_Person = $('#step_Person').val();

        const data = {
            charter_Id: charter_Id,
            step_Client: step_Client,
            step_Agency: step_Agency,
            step_Fees: step_Fees,
            step_Time: step_Time,
            step_Person: step_Person,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addCharterStep',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#step_Submit').prop('disabled', false);
                    notyf.success({
                        message: 'Add Charter Step Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddStepForm')[0].reset();
                        $('#AddStepModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Charter Step. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#step_Submit').prop('disabled', false);
        })
    }
}

getCharterStep = (charter_Id) => {
    let step_Display = $('#step_Display')

    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharterStep/${charter_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterstepformat = `
                    <tr>
                        <td>${data.step_Client.replace(/\n/g, '</p><p>')}</td>
                        <td>${data.step_Agency.replace(/\n/g, '</p><p>')}</td>
                        <td class="text-center">${data.step_Fees}</td>
                        <td class="text-center">${data.step_Time}</td>
                        <td>${data.step_Person.replace(/\n/g, '</p><p>')}</td>
                        <td style="width: 25%;" class="text-center">
                        <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#EditStepModal" onclick="foreditcharterstep('${data.step_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button type="button" class="btn btn-danger waves-effect waves-light mb-2" onclick="deleteCharterStep('${data.step_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                        </td>
                    </tr>
                        `;

                    step_Display.append(charterstepformat)

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Step Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Step Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditcharterstep = (step_Id) => getCharterStepforEdit(step_Id)

getCharterStepforEdit = (step_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharterStepInfo/${step_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#edit_step_Id').val(data.step_Id);
            $('#edit_step_Client').val(data.step_Client);
            $('#edit_step_Agency').val(data.step_Agency);
            $('#edit_step_Fees').val(data.step_Fees);
            $('#edit_step_Time').val(data.step_Time);
            $('#edit_step_Person').val(data.step_Person);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Step Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editCharterStep = (step_Id) => {
    if ($('#EditStepForm')[0].checkValidity()) {
        const form = new FormData($('#EditStepForm')[0]);

        $('#edit_step_Submit').prop('disabled', true);

        const step_Id = $('#edit_step_Id').val();
        const step_Client = $('#edit_step_Client').val();
        const step_Agency = $('#edit_step_Agency').val();
        const step_Fees = $('#edit_step_Fees').val();
        const step_Time = $('#edit_step_Time').val();
        const step_Person = $('#edit_step_Person').val();

        const data = {
            step_Client: step_Client,
            step_Agency: step_Agency,
            step_Fees: step_Fees,
            step_Time: step_Time,
            step_Person: step_Person,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editCharterStep/${step_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_step_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Charter Step Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditStepForm')[0].reset();
                        $('#EditStepModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while editing charter step. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_step_Submit').prop('disabled', false);
        })
    }
}

deleteCharterStep = (step_Id) => {

    Swal.fire({
        title: 'Delete Charter Step',
        html: 'Are you sure do you want to delete this Charter Step?',
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
                url: `/api/admin/deleteCharterStep/${step_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Charter Step Successfully',
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
                    text: 'Something went wrong while deleting charter step. Please try again.',
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