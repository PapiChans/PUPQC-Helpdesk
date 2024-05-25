$(function () {
    getAllTicketRating();
})

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

getAllTicketRating = () => {
    const dt = $('#rating-datatable');

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getAllTicketRating',
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
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Office;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.ticket_Rating;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.date_Created;
                        return `${formatPostgresTimestamp(ticketnum)}`;
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.resolved_Date;
                        return `${formatPostgresTimestamp(ticketnum)}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let ticketnum = data.ticket_Remarks;
                        if (data.ticket_Remarks == null) {
                            ticketnum = '';
                        }
                        return `${ticketnum}`;
                    },
                },
            ],
            order: [[0, 'asc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};