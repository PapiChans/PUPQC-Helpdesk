$(function() {
    getInstruction();
})

const notyf = new Notyf();

getInstruction = () => {
    let instruction_display = $('#instruction_display')

    $.ajax({
        type: 'GET',
        url: '/api/student/getInstruction',
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