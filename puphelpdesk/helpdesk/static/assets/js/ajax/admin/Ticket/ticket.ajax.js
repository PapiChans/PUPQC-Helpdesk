$(function () {
    getAllTicket();
})

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
    const detailsURL = `/admin/ticket/view?ticket_number=${ticketId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

function updateTicketPriority(ticketNumber, newPriority) {
    $.ajax({
        url: `/api/admin/updateTicketPriority`,
        type: 'POST',
        data: {
            ticketNumber: ticketNumber,
            newPriority: newPriority,
            csrfmiddlewaretoken: csrftoken // Assuming you have csrftoken available
        },
        success: function(response) {
            notyf.success('Priority updated successfully');
            // Reload the data table to reflect the changes
            $('#pending-datatable').DataTable().ajax.reload();
            $('#all-datatable').DataTable().ajax.reload();
            $('#closed-datatable').DataTable().ajax.reload();
        },
        error: function(error) {
            notyf.error('Failed to update priority');
        }
    });
}

function updateTicketStatus(ticketNumber, newStatus) {
    $.ajax({
        url: `/api/admin/updateTicketStatus`,
        type: 'POST',
        data: {
            ticketNumber: ticketNumber,
            newStatus: newStatus,
            csrfmiddlewaretoken: csrftoken // Assuming you have csrftoken available
        },
        success: function(response) {
            notyf.success('Status updated successfully');
            // Reload the data table to reflect the changes
            $('#pending-datatable').DataTable().ajax.reload();
            $('#all-datatable').DataTable().ajax.reload();
            $('#closed-datatable').DataTable().ajax.reload();
        },
        error: function(error) {
            notyf.error('Failed to update status');
        }
    });
}

getAllTicket = () => {
    const dt = $('#all-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getAllTicket',
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
                    width: '10%',
                    render: (data) => {
                        let title = data.ticket_Title
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const name = data.full_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                    let ticket_Priority = data.ticket_Priority;
                    let badgeClass = '';

                    switch(ticket_Priority) {
                        case 'Unassigned':
                            badgeClass = 'badge bg-secondary text-secondary-fg';
                            break;
                        case 'Low':
                            badgeClass = 'badge bg-blue text-blue-fg'; // You can choose your preferred color
                            break;
                        case 'Mid':
                            badgeClass = 'badge bg-green text-green-fg'; // You can choose your preferred color
                            break;
                        case 'High':
                            badgeClass = 'badge bg-orange text-orange-fg'; // You can choose your preferred color
                            break;
                        case 'Urgent':
                            badgeClass = 'badge bg-red text-red-fg'; // You can choose your preferred color
                            break;
                        default:
                            badgeClass = 'badge bg-danger text-danger-fg'; // Default color if priority is unknown
                    }

                    return `<span class="${badgeClass}">${ticket_Priority}</span>`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const office = data.ticket_Office
                        return `${office}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const status = data.ticket_Status;
                        return `
                            <div class="dropdown">
                                <button class="btn btn-info dropdown-toggle" type="button" id="statusDropdown-${data.ticket_Status}" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${status}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="statusDropdown-${data.ticket_Status}">
                                    <li><a class="dropdown-item" href="#" onclick="updateTicketStatus('${data.ticket_Status}', 'Pending')">Pending</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="updateTicketStatus('${data.ticket_Status}', 'Replied')">Replied</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="updateTicketStatus('${data.ticket_Status}', 'Closed')">Closed</a></li>
                                </ul>
                            </div>
                        `;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const date = data.date_Created
                        return `${formatPostgresTimestamp(date)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}