$(function() {
    $('#AddFinancialGuideForm').on('submit', function (e) {
        addGuidePost()
        e.preventDefault() // prevent page refresh
    })
})

$('input[type="date"]').flatpickr({
    mode: 'single',
    allowInput: true,
    dateFormat: "Y-m-d"
});

function generateRandomNumber() {
    // Define the prefix for the ticket number
    const prefix = "guide-";

    // Define the length of the random part
    const randomLength = 20;

    // Generate a random string of alphanumeric characters
    const randomPart = Array.from({ length: randomLength }, () =>
        Math.random().toString(36).charAt(2)
    ).join('');

    // Combine the prefix and the random part to create the ticket number
    const Number = prefix + randomPart;

    return Number;
}

const notyf = new Notyf();

addGuidePost = () => {
    if ($('#AddFinancialGuideForm')[0].checkValidity()) {
        $('#guide_Submit').prop('disabled', true);
        const form = new FormData($('AddFinancialGuideForm')[0]);
        
        const guide_Type = $('#guide_Type').val();
        const guide_Number = generateRandomNumber();
        const guide_Program = $('#guide_Program').val();
        const guide_Description = $('#guide_Description').val();
        const guide_Apply = $('#guide_Apply').val();
        const guide_To_Submit = $('#guide_To_Submit').val();
        const guide_Contact = $('#guide_Contact').val();
        const guide_Deadline_Start = $('#guide_Deadline_Start').val();
        const guide_Deadline_End = $('#guide_Deadline_End').val();
        const guide_Remarks = $('#guide_Remarks').val();

        if (guide_Deadline_Start > guide_Deadline_End) {
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'You cannot set the date where the Deadline date end is set before the Deadline start date.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#guide_Submit').prop('disabled', false);
        }
        else {

            const data = {
                guide_Type: guide_Type,
                guide_Number: guide_Number,
                guide_Program: guide_Program,
                guide_Description: guide_Description,
                guide_Apply: guide_Apply,
                guide_To_Submit: guide_To_Submit,
                guide_Contact: guide_Contact,
                guide_Deadline_Start: guide_Deadline_Start,
                guide_Deadline_End: guide_Deadline_End,
                guide_Remarks: guide_Remarks,
            };
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addFinancialGuide',
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#guide_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Guide Post Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#AddFinancialGuideForm')[0].reset();
                            window.location.href = `/admin/financial-aid-and-scholarships`
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding guide post. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#guide_Submit').prop('disabled', false);
            })
        }
    }
}