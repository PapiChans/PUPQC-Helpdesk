$(function() {
    $('#AddInstructionForm').on('submit', function (e) {
        addInstruction()
        e.preventDefault() // prevent page refresh
    })
    getInstruction();
    $('#EditInstructionForm').on('submit', function (e) {
        editInstruction()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

$('input#instruction_Step_Number').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

$('input#edit_instruction_Step_Number').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use a regular expression to check if the value is a number
    return /^[0-9]+$/.test(value);
}

addInstruction = () => {
    if ($('#AddInstructionForm')[0].checkValidity()) {
        const form = new FormData($('#AddInstructionForm')[0]);

        $('#instruction_Submit').prop('disabled', true);
        
        const instruction_Step_Number = $('#instruction_Step_Number').val();
        const instruction_Title = $('#instruction_Title').val();
        const instruction_Info = $('#instruction_Info').val();

        if (!isValidNumber(instruction_Step_Number)){
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
            $('#instruction_Submit').prop('disabled', false);
        }

        else {

            const data = {
                instruction_Step_Number: instruction_Step_Number,
                instruction_Title: instruction_Title,
                instruction_Info: instruction_Info,
            };
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addInstruction',
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#instruction_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Instruction Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#AddInstructionForm')[0].reset();
                            $('#AddInstructionModal').modal('hide');
                                location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding retrieval instruction. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#instruction_Submit').prop('disabled', false);
            })
        }
    }
}

getInstruction = () => {
    let instruction_display = $('#instruction_display')

    $.ajax({
        type: 'GET',
        url: '/api/admin/getInstruction',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const instructiondata = result;
            if (instructiondata.length > 0) {
                instructiondata.forEach((instructiondata) => {

                    let instructionformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">Step ${instructiondata.instruction_Step_Number}: ${instructiondata.instruction_Title}</h3>
                            <p>${instructiondata.instruction_Info}</p>
                        </div>
                        <div class="card-footer">
                        <button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditInstructionModal" onclick="foreditinstruction('${instructiondata.instruction_Id}')">Edit Step</button>
                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteInstruction('${instructiondata.instruction_Id}')">Delete</button>
                        </div>
                    </div>
                    `;

                    instruction_display.append(instructionformat)

                });
                $('#no-instruction').html(null);
            }
            else {
                notyf.success({
                    message: 'No Instruction Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Instruction Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditinstruction = (instruction_Id) => getInstructionforEdit(instruction_Id)

getInstructionforEdit = (instruction_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getInstructionInfo/${instruction_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const editinstructiondata = result;
            $('#edit_instruction_Id').val(editinstructiondata.instruction_Id);
            $('#edit_instruction_Step_Number').val(editinstructiondata.instruction_Step_Number);
            $('#edit_instruction_Title').val(editinstructiondata.instruction_Title);
            $('#edit_instruction_Info').val(editinstructiondata.instruction_Info);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Instruction Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editInstruction = () => {
    if ($('#EditInstructionForm')[0].checkValidity()) {
        const form = new FormData($('#EditInstructionForm')[0]);

        $('#edit_instruction_Submit').prop('disabled', true);
        
        const instruction_Id = $('#edit_instruction_Id').val();
        const instruction_Step_Number = $('#edit_instruction_Step_Number').val();
        const instruction_Title = $('#edit_instruction_Title').val();
        const instruction_Info = $('#edit_instruction_Info').val();

        if (!isValidNumber(instruction_Step_Number)){
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
            $('#edit_instruction_Submit').prop('disabled', false);
        }

        else {

            const data = {
                instruction_Step_Number: instruction_Step_Number,
                instruction_Title: instruction_Title,
                instruction_Info: instruction_Info,
            };
            
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editInstruction/${instruction_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#edit_instruction_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Instruction Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditInstructionForm')[0].reset();
                            $('#EditInstructionModal').modal('hide');
                                location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while saving retrieval instruction. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#edit_instruction_Submit').prop('disabled', false);
            })
        }
    }
}

deleteInstruction = (instruction_Id) => {

    Swal.fire({
        title: 'Delete Instruction Step',
        html: 'Are you sure do you want to delete this retrieval instruction?',
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
                url: `/api/admin/deleteInstruction/${instruction_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Instruction Step Successfully',
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
                    text: 'Something went wrong while deleting instruction step. Please try again.',
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