$(function() {
    getFinancialGuide();
    getScholarship();
    $('#EditGuideForm').on('submit', function (e) {
        editGuide()
        e.preventDefault() // prevent page refresh
    })
})

$('input[type="date"]').flatpickr({
    mode: 'single',
    minDate: "today",
    allowInput: true,
    dateFormat: "Y-m-d"
});

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

function getGuideInfoAndNavigate(guideNumber) {

    // Create the URL with the guide_Id parameter
    const detailsURL = `/admin/financial-aid-and-scholarships/details?guide_number=${guideNumber}`;
    
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
                url: '/api/admin/getFinancialAid',
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
                        return `<button type="button" class="btn btn-primary waves-effect waves-light" onclick="getGuideInfoAndNavigate('${data.guide_Number}')">Details</button></a>
                                <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#GuideEditModal" onclick="foreditguide('${data.guide_Id}')">Edit</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteGuide('${data.guide_Id}')">Delete</button>
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
                url: '/api/admin/getScholarship',
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
                        return `
                                <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getGuideInfoAndNavigate('${data.guide_Number}')">Details</button></a>
                                <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#GuideEditModal" onclick="foreditguide('${data.guide_Id}')">Edit</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteGuide('${data.guide_Id}')">Delete</button>
                                `
                    },
                },
            ],
            order: [[1, 'desc']],
        })
    }
}

foreditguide = (guide_Id) => getGuideforEdit(guide_Id)

getGuideforEdit = (guide_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getGuideInfoEdit/${guide_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const guidedata = result;
            $('#edit_guide_Id').val(guidedata.guide_Id);
            $('#edit_guide_Type').val(guidedata.guide_Type);
            $('#edit_guide_Program').val(guidedata.guide_Program);
            $('#edit_guide_Description').val(guidedata.guide_Description);
            $('#edit_guide_Apply').val(guidedata.guide_Apply);
            $('#edit_guide_To_Submit').val(guidedata.guide_Submit);
            $('#edit_guide_Contact').val(guidedata.guide_Contact);
            $('#edit_guide_Deadline_Start').val(guidedata.guide_Deadline_Start);
            $('#edit_guide_Deadline_End').val(guidedata.guide_Deadline_End);
            $('#edit_guide_Remarks').val(guidedata.guide_Remarks);
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

editGuide = (guide_Id) => {

    if ($('#EditGuideForm')[0].checkValidity()) {
        const form = new FormData($('#EditGuideForm')[0]);

        $('#edit_guide_Submit').prop('disabled', true);
        
        const guide_Id = $('#edit_guide_Id').val();
        const guide_Type = $('#edit_guide_Type').val();
        const guide_Program = $('#edit_guide_Program').val();
        const guide_Description = $('#edit_guide_Description').val();
        const guide_Apply = $('#edit_guide_Apply').val();
        const guide_To_Submit = $('#edit_guide_To_Submit').val();
        const guide_Contact = $('#edit_guide_Contact').val();
        const guide_Deadline_Start = $('#edit_guide_Deadline_Start').val();
        const guide_Deadline_End = $('#edit_guide_Deadline_End').val();
        const guide_Remarks = $('#edit_guide_Remarks').val();

        if (guide_Deadline_Start > guide_Deadline_End) {
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'You cannot set the date where the Deadline date end is set before the Deadline start date.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_guide_Submit').prop('disabled', false);
        }
        else {
            const data = {
                guide_Type: guide_Type,
                guide_Program: guide_Program,
                guide_Description: guide_Description,
                guide_Apply: guide_Apply,
                guide_To_Submit: guide_To_Submit,
                guide_Contact: guide_Contact,
                guide_Deadline_Start: guide_Deadline_Start,
                guide_Deadline_End: guide_Deadline_End,
                guide_Remarks: guide_Remarks,
            };
        
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editGuide/${guide_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#edit_guide_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Guide Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditGuideForm')[0].reset();
                            $('#GuideEditModal').modal('hide');

                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while saving guide post. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#edit_guide_Submit').prop('disabled', false);
            })
        }
    }
}

deleteGuide = (guide_Id) => {

    Swal.fire({
        title: 'Delete Event',
        html: 'Are you sure do you want to delete this program post?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: `/api/admin/deleteGuide/${guide_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Guide Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting guide post. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
            })
        }
    })
}