$(function () {
    getPendingTicket();
    getAllTicket();
    getClosedTicket();
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

getPendingTicket = () => {
    const dt = $('#pending-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getPendingTicket',
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
                        const date = data.date_Created
                        return `${formatPostgresTimestamp(date)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
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
                        const date = data.date_Created
                        return `${formatPostgresTimestamp(date)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}

getClosedTicket = () => {
    const dt = $('#closed-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getClosedTicket',
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
                        const date = data.date_Created
                        return `${formatPostgresTimestamp(date)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}