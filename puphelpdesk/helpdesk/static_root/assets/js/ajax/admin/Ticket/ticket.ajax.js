$(function () {
    getOpenTicket();
    getClosedTicket();
    getResponseTicket();
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

getOpenTicket = () => {
    const dt = $('#open-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getOpenTicket',
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
                    width: '10%',
                    render: (data) => {
                        let fullname = data.full_Name
                        return `${fullname}`
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
            order: [[2, 'desc']],
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
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let fullname = data.full_Name
                        return `${fullname}`
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
            order: [[2, 'desc']],
        })
    }
}

getResponseTicket = () => {
    const dt = $('#response-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getResponseTicket',
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
                    width: '10%',
                    render: (data) => {
                        let fullname = data.full_Name
                        return `${fullname}`
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
            order: [[2, 'desc']],
        })
    }
}