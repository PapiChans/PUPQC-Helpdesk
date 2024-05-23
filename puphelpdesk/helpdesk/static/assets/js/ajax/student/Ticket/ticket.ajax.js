$(function () {
    getTicket();
    getuserprofileforticket()
    $('#AddTicketForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        addTicket()
    })
})

$('input#ticket_Title').maxlength({
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
                url: '/api/student/getTicketbyUser',
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
                    class: 'text-left',
                    render: (data) => {
                        const title = data.ticket_Title
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let status = data.ticket_Status;
                        let badgeClass = '';
                        
                        switch(status) {
                            case 'Pending':
                                badgeClass = 'badge bg-silver text-silver-fg';
                                break;
                            case 'Open':
                                badgeClass = 'badge bg-yellow text-yellow-fg';
                                break;
                            case 'In Progress':
                                badgeClass = 'badge bg-cyan text-cyan-fg';
                                break;
                            case 'Approval':
                                badgeClass = 'badge bg-blue text-blue-fg';
                                break;
                            case 'On Hold':
                                badgeClass = 'badge bg-orange text-orange-fg';
                                break;
                            case 'Resolved':
                                badgeClass = 'badge bg-green text-green-fg';
                                break;
                            case 'Closed':
                                badgeClass = 'badge bg-black text-black-fg';
                                break;
                            default:
                                badgeClass = 'badge bg-danger text-danger-fg';
                        }
                        
                        return `<span class="${badgeClass}">${status}</span>`;
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
                        let content = '';
                        if (data === null || data.resolved_Date === null) {
                            content = ''; // Return empty string if data or resolved_Date is null
                        } else {
                            const date = formatPostgresTimestamp(data.resolved_Date);
                            content = `${date}`;
                        }
                        // Add feedback button if status is 'Closed' and closed by Admin
                        if (data.ticket_Status === 'Closed' && data.closed_By === 'Admin') {
                            content += `<br><a href="{% url 'feedback' %}?ticket_number=${data.ticket_Number}" class="btn btn-sm btn-primary mt-2">Provide Feedback</a>`;
                        }
                        return content;
                    }
                }                
            ],
            order: [[3, 'desc']],
        })
    }
}

getuserprofileforticket = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#ticket_full_Name').val(profiledata.user_Last_Name+", "+ profiledata.user_First_Name);
            $('#ticket_user_Id').val(profiledata.user_Id);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Fetch Profile Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

addTicket = () => {
    if ($('#AddTicketForm')[0].checkValidity()) {
        const user_Id = $('#ticket_user_Id').val();
        const full_Name = $('#ticket_full_Name').val();
        const sender_Affiliation = $('#sender_Affiliation').val();
        const ticket_Type = $('#ticket_Type').val();
        const ticket_Priority = $('#ticket_Priority').val();
        const ticket_Office = $('#ticket_Office').val(); // Added to get selected office
        const ticket_Title = $('#ticket_Title').val();
        const ticket_Service = $('#ticket_Service').val();
        const comment_Text = $('#comment_Text').val();

        const data = {
            user_Id: user_Id,
            full_Name: full_Name,
            sender_Affiliation: sender_Affiliation,
            ticket_Type: ticket_Type,
            ticket_Priority: ticket_Priority,
            ticket_Office: ticket_Office, // Pass selected office to data
            ticket_Title: ticket_Title,
            comment_Text: comment_Text,
            ticket_Service: ticket_Service,
        };

        Swal.fire({
            title: 'Warning',
            text: 'Once you submit your ticket, you cannot edit this anymore.',
            icon: 'warning',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonClass: 'btn btn-danger w-xs mb-1',
            confirmButtonColor: '#D40429',
        }).then((result) => {
            if (result.isConfirmed) {
                $('#ticket_Submit').prop('disabled', true);
                $.ajax({
                    type: 'POST',
                    url: '/api/student/addTicket',
                    data: data,
                    dataType: 'json',
                    headers: {'X-CSRFToken': csrftoken},
                    success: (response) => {
                        if (response.message === "Submit Ticket and Comment Successfully") { // Check the success message
                            notyf.success({
                                message: 'Ticket added successfully',
                                position: {x: 'right', y: 'top'},
                                duration: 2500
                            });
                            $('#AddTicketModal').modal('hide'); // Close modal
                            $('#AddTicketForm')[0].reset(); // Clear form
                            const dt = $('#ticket-datatable').DataTable();
                            dt.clear().destroy(); // Destroy the existing DataTable instance
                            getTicket(); // Reload data table
                        } else {
                            Swal.fire({
                                title: 'Oops!',
                                text: 'Something went wrong while submitting the ticket. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'Okay',
                                confirmButtonColor: '#D40429',
                            });
                            $('#ticket_Submit').prop('disabled', false);
                        }
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while submitting the ticket. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                        $('#ticket_Submit').prop('disabled', false);
                    }
                });
            }
        });
    }
};
