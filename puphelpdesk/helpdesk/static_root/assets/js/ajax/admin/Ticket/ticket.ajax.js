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


getAllTicket = () => {
    const dt = $('#all-datatable');

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getAllTicket',
                contentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            buttons: [
                {
                    extend: 'collection',
                    text: 'Export',
                    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                }
            ],
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let title = data.ticket_Title;
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const name = data.full_Name;
                        return `${name}`;
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
                            case 'Medium':
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
                        const office = data.ticket_Office;
                        return `${office}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
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
                        const date = data.date_Created;
                        return `${formatPostgresTimestamp(date)}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const date = data.resolved_Date;
                        return `${formatPostgresTimestamp(date)}`;
                    },
                },
            ],
            order: [[0, 'asc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};

getStatus = (status) => {
    const dt = $('#all-datatable').DataTable();

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt) {
        dt.destroy(); // Destroy existing instance

        $('#all-datatable').DataTable({
            ajax: {
                type: 'GET',
                url: status ? `/api/admin/getTicketbyStatus/${status}` : '/api/admin/getAllTicket' ,
                contentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            buttons: [
                {
                    extend: 'collection',
                    text: 'Export',
                    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                }
            ],
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let title = data.ticket_Title;
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const name = data.full_Name;
                        return `${name}`;
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
                            case 'Medium':
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
                        const office = data.ticket_Office;
                        return `${office}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
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
                        const date = data.date_Created;
                        return `${formatPostgresTimestamp(date)}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const date = data.resolved_Date;
                        return `${formatPostgresTimestamp(date)}`;
                    },
                },
            ],
            order: [[0, 'asc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};
