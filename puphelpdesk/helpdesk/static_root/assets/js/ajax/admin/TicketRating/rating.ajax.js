$(function () {
    getAllTicketRating();
    superadminblocker();
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

$('input[type="date"]').flatpickr({
    mode: 'single',
    maxDate: "today",
    allowInput: true,
    dateFormat: "Y-m-d"
});

superadminblocker = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            if (profiledata.is_master_admin == false){
                $('#ticket_office').html(null);
                $('#ticket_office').html(`<option value="${profiledata.admin_Office}">${profiledata.admin_Office}</option>`);
                $('#ticket_office').val(profiledata.admin_Office);
                $('#ticket_office').prop('disabled', true);
            }
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
            order: [[4, 'desc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};


getSortedTicketRatings = () => {
    const dt = $('#rating-datatable').DataTable();

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt) {
        dt.destroy(); // Destroy existing instance

        $('#rating-datatable').DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/sortTicketRatings', // URL for sorting ticket ratings
                contentType: 'application/x-www-form-urlencoded',
                dataSrc: '',
                data: {
                    ticket_rating: $('#ticket_rating').val(),
                    ticket_office: $('#ticket_office').val(),
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
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
