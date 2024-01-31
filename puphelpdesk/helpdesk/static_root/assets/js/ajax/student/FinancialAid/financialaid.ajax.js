$(function() {
    getFinancialGuide();
    getScholarship();
})

const notyf = new Notyf();

// Date Formatter
function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

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

function getGuideInfoAndNavigate(guideId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/student/financial-aid-and-scholarships/details?guide_id=${guideId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getFinancialGuide = () => {
    const dt = $('#financialaid-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getFinancialAid',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    render: (data) => {
                        const program = data.guide_Program
                        return `${program}`
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
                        const startDeadline = formatDate(data.guide_Deadline_Start)
                        const endDeadline = formatDate(data.guide_Deadline_End)
                        return `${startDeadline} - ${endDeadline}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" onclick="getGuideInfoAndNavigate('${data.guide_Id}')">Details</button></a>
                                `
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
}

getScholarship = () => {
    const dt = $('#scholarships-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getScholarship',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    render: (data) => {
                        const program = data.guide_Program
                        return `${program}`
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
                        const startDeadline = formatDate(data.guide_Deadline_Start)
                        const endDeadline = formatDate(data.guide_Deadline_End)
                        return `${startDeadline} - ${endDeadline}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" onclick="getGuideInfoAndNavigate('${data.guide_Id}')">Details</button></a>
                                `
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
}