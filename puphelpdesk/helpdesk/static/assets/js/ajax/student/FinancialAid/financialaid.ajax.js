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
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#GuideInfoModal" onclick="getGuideInfo('${data.guide_Id}')">Read More</button>
                                `
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
    notyf.success({
        message: 'Financial Aid Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
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
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#GuideInfoModal" onclick="getGuideInfo('${data.guide_Id}')">Read More</button>
                                `
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
    notyf.success({
        message: 'Scholarship Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
}

getGuideInfo = (guide_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getGuideInfo/${guide_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const guidedata = result;
            $('#guide_type_info').html(guidedata.guide_Type);
            $('#guide_program_info').html(guidedata.guide_Program);
            $('#guide_description_info').html(guidedata.guide_Description);
            $('#guide_apply_info').html(guidedata.guide_Apply);
            $('#guide_submit_info').html(guidedata.guide_Submit);
            $('#guide_contact_info').html(guidedata.guide_Contact);
            $('#guide_deadline_start_info').html(formatDate(guidedata.guide_Deadline_Start));
            $('#guide_deadline_end_info').html(formatDate(guidedata.guide_Deadline_End));
            $('#guide_remarks_info').html(guidedata.guide_Remarks);
            
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Guide Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}