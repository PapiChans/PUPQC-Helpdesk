$(function () {
    $('#SendTicketForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        addTicket()
    })

})

addTicket = () => {
    if ($('#SendTicketForm')[0].checkValidity()) {
        const formData = {
            sender_Email: $('#sender_Email').val(),
            sender_Name: $('#sender_Name').val(),
            sender_Affiliation: $('#sender_Affiliation').val(),
            ticket_Type: $('#ticket_Type').val(),
            ticket_Status: 'Open',
            Description: $('#ticket_Description').val(),
        };

        Swal.fire({
            title: 'Warning',
            text: 'Once you submit your ticket, you cannot edit this anymore.',
            icon: 'warning',
            allowEnterKey: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonClass: 'btn btn-danger w-xs mb-1',
            confirmButtonColor: '#D40429',
        }).then((result) => {
            if (result.isConfirmed) {
                $('#submit_ticket').prop('disabled', true);
                $.ajax({
                    type: 'POST',
                    url: '/api/student/sendTicket', 
                    data: formData,
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#submit_ticket').prop('disabled', true);
                            notyf.success({
                                message: 'Ticket added successfully!',
                                position: {x: 'right', y: 'top'},
                                duration: 2500
                            });
                            $('#SendTicketForm')[0].reset();
                            window.location.href = `/user/ticket/view?ticket_number=${result.data.ticket_Number}`;
                        }
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while submitting the ticket. Please try again.',
                            icon: 'error',
                            allowEnterKey: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                        $('#submit_ticket').prop('disabled', false);
                    }
                });
            }
        });
    }
};
