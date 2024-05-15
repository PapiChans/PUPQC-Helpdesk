$(function () {
    getTicket();
    preventduplicate();
    getuserprofileforticket()
    $('#SendTicketForm').on('submit', function (e) {
        e.preventDefault()
        addTicket()
    })

})

$('input#ticket_Type').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

const notyf = new Notyf();

function formatPostgresTimestamp(postgresTimestamp) {
    const date = new Date(postgresTimestamp);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

function getTicketInfoAndNavigate(ticketId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/user/ticket/view?ticket_number=${ticketId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getTicket = () => {
    const dt = $('#ticket-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Number
                        return `${ticketnum}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const title = data.ticket_Type
                        return `${title}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let status = data.ticket_Status
                        if (data.ticket_Status == 'Open'){
                            status = '<span class="badge bg-success text-success-fg">Open</span>'
                        }
                        else if (data.ticket_Status == 'Replied') {
                            status = `<span class="badge bg-warning text-warning-fg">Replied</span>`
                        }
                        else if (data.ticket_Status == 'Closed') {
                            status = `<span class="badge bg-secondary text-secondary-fg">Closed</span>`
                        }
                        else {
                            status = `<span class="badge bg-danger text-danger-fg">Unknown</span>`
                        }
                        return `${status}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const date = formatPostgresTimestamp(data.date_Created)
                        return `${date}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">View</button></a>
                                `
                    },
                },
            ],
            order: [[3, 'desc']],
        })
    }
}

preventduplicate = () => {
    let addbutton = $('#create_button');

    $.ajax({
        type: 'GET',
        url: '/api/',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            // Check if there is an closed ticket
            const hasOpenTicket = data.length == 0 || data.every(ticket => ticket.ticket_Status == 'Closed');

            // Hide or show the create button based on the open ticket status
            if (hasOpenTicket) {
                let button = `<button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#AddTicketModal">Create a Ticket</button>`;
                addbutton.append(button);
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Ticket Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

addTicket = () => {
    if ($('#SendTicketForm')[0].checkValidity()) {
        const form = new FormData($('#SendTicketForm')[0]);
        
        const ticket_Id = $('#ticket_ticket_Id').val();
        const sender_Name = $('#sender_Name').val();
        const ticket_Type = $('#ticket_Type').val();
        const Description = $('#ticket_Description').val();

        const data = {
            ticket_Id: ticket_Id,
            sender_Name: sender_Name,
            ticket_Type: ticket_Type,
            Description: Description,
        };

        Swal.fire({
            title: 'Warning',
            text: 'Once you submit your ticket, you cannot edit this anymore.',
            icon: 'warning',
            allowEnterKey: 'false',
            allowOutsideClick: 'false',
            allowEscapeKey: 'false',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonClass: 'btn btn-danger w-xs mb-1',
            confirmButtonColor: '#D40429',
        })
        .then((result) => {
            if (result.isConfirmed) {
                $('#submit_ticket').prop('disabled', true);
                $.ajax({
                    type: 'POST',
                    url: '/api/',
                    data: data,
                    dataType: 'json',
                    headers: {'X-CSRFToken': csrftoken},
                    success: (result) => {
                        if (result) {
                            $('#submit_ticket').prop('disabled', true);
                            notyf.success({
                                message: 'Add Ticket Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                                $('form#SendTicketForm')[0].reset();
                                window.location.href = `/user/ticket/view?ticket_number=${result.ticket_Number}`;
                        }
                    },
                })
                .fail(() => {
                    Swal.fire({
                        title: 'Oops!',
                        text: 'Something went wrong while submitting ticket. Please try again.',
                        icon: 'error',
                        allowEnterKey: 'false',
                        allowOutsideClick: 'false',
                        allowEscapeKey: 'false',
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#D40429',
                    })
                    $('#submit_ticket').prop('disabled', false);
                })
        }})
    }
}