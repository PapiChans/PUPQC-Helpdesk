$(function () {
    getadminprofileforrequest()
    getMNRequest()
    $('#AddRequestForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        addRequest(CommentAttachment)
    })
    getMYRequest()
    superadminblocker()
})

$('input[type="date"]').flatpickr({
    mode: 'single',
    maxDate: "today",
    allowInput: true,
    dateFormat: "Y-m-d"
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

function getRequestInfoAndNavigate(requestId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/admin/request/view?request_number=${requestId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

CommentAttachment = FilePond.create(document.querySelector('#comment_Attachment'), {
    instantUpload: false,
    allowProcess: false,
})

addRequest = (CommentAttachment) => {
    if ($('#AddRequestForm')[0].checkValidity()) {

        const form = new FormData($('#AddRequestForm')[0]);

        const user_Id = $('#request_user_Id').val();
        const full_Name = $('#request_full_Name').val();
        const request_Type = $('#request_Type').val();
        const request_Office = $('#request_Office').val();
        const request_Service = $('#request_Service').val();
        const request_Title = $('#request_Title').val();
        const comment_Text = $('#comment_Text').val();

        if (form.get('comment_Attachment') == '' || Object.prototype.toString.call(form.get('comment_Attachment')) === '[object File]') {
            form.delete('comment_Attachment');
        }

        Swal.fire({
            title: 'Attention',
            text: 'Please review the following details carefully before submitting your message.',
            icon: 'info',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            cancelButtonClass: 'btn btn-danger w-xs mb-1',
            confirmButtonColor: '#D40429',
        }).then((result) => {
            if (result.isConfirmed) {
                $('#request_Submit').prop('disabled', true);

                form.append('user_Id', user_Id);
                form.append('full_Name', full_Name);
                form.append('request_Type', request_Type);
                form.append('request_Office', request_Office);
                form.append('request_Service', request_Service);
                form.append('request_Title', request_Title);
                form.append('comment_Text', comment_Text);

                $.ajax({
                    type: 'POST',
                    url: '/api/admin/addTicketRequest',
                    data: form,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    headers: { 'X-CSRFToken': csrftoken },
                    success: (response) => {
                        if (response.message === "Request submitted successfully") {
                            notyf.success({
                                message: 'Request added successfully',
                                position: { x: 'right', y: 'top' },
                                duration: 2500
                            });
                            $('#request_Submit').prop('disabled', false);
                            $('#AddRequestModal').modal('hide');
                            $('#AddRequestForm')[0].reset();
                            location.reload();
                        } else {
                            Swal.fire({
                                title: 'Oops!',
                                text: 'Something went wrong while submitting the request. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'Okay',
                                confirmButtonColor: '#D40429',
                            });
                            $('#request_Submit').prop('disabled', false);
                        }
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while submitting the request. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                        $('#request_Submit').prop('disabled', false);
                    }
                });
            }
        });
    }
};


getadminprofileforrequest = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#request_full_Name').val(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
            $('#request_user_Id').val(profiledata.user_Id);
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

$(document).ready(function() {
    const officeToServices = {
        "Director's Office": ["Permission to Conduct an Activity", "Others"],
        "Academic Office": ["Request for Certificate of Good Moral Character", "Processing of Online Request for Tutorial of Subject", "Application for Replacement of Lost Registration Certificate", "Others"],
        "Student Affairs and Service Office": ["Application for New Identification Card", "Application for Replacement of Lost Identification Card", "Others"],
        "Registrar's Office": ["Application for Overload of Subjects", "Processing of Req. for Credentials Service (Cert., Authentication, Verification (CAV/APOSTILLE))", "Processing of Request for Academic Verification Service", "Others"],
        "Admission Office": ["Re-Admission (Returning Students)", "Issuance of Follow-up of Students Referred during enrollment.", "Processing of Application for Correction of Grade Entry, Late Reporting of Grades, & Incomplete Mark", "Processing of Application for Change of Enrollment (Change of Schedule/Subject)", "Processing of Application for Change of Enrollment (Adding of Subject)", "Processing of Application for Cross-Enrollment", "Processing of Application for Shifting", "Processing of Course Accreditation Service for Transferees", "Processing of Freshman Admission", "Processing of Manual Enrollment", "Others"],
        "Cash and Disbursing Office": ["Processing of Refunds", "Others"],
        "Accounting Office": ["Processing of Payment for Completion of Incomplete Grades", "Liquidation of Cash Advance", "Request of Certification for No Unliquidated Cash Advance", "Others"],
        "Quality Assurance Center and OJT Office": ["Request for Memorandum of Agreement for Internship", "Others"],
        "IT Laboratory Office": ["Request for the Reservation of Campus Facility", "Others"],
        "Medical Clinic": ["Issuance of Dental Clearance", "Issuance of Annual Medical Clearance", "Consultation and Treatment Services for Emergency Dental Cases of Students", "Consultation and Treatment Services for Emergency Dental Cases of Faculty and Admin. Employees", "Issuance of Medical Certificate for Sick Note/Excuse Slip", "Issuance of Medical Clearance for Enrollment", "Issuance of Medical Clearance for Laboratory Classes for Food-Handlers", "Issuance of Medical Clearance for Off-Campus of Students", "Issuance of Medical Clearance for On-the-job-Training of Students", "Others"],
        // "All": ["Application for New Identification Card", "Application for Overload of Subjects", "Application for Replacement of Lost Identification Card",
        // "Application for Replacement of Lost Registration Certificate", "Application of General Clearance", "Circulation Services", "Consultation and Treatment Services for Emergency Dental Cases of Faculty and Admin. Employees",
        // "Consultation and Treatment Services for Emergency Dental Cases of Students", "Issuance of Annual Medical Clearance", "Issuance of Dental Clearance",
        // "Issuance of Follow-up of Students Referred during enrollment.", "Issuance of Medical Certificate for Sick Note/Excuse Slip", "Issuance of Medical Clearance for Enrollment",
        // "Issuance of Medical Clearance for Laboratory Classes for Food-Handlers", "Issuance of Medical Clearance for Off-Campus of Students", "Issuance of Medical Clearance for On-the-job-Training of Students",
        // "Issuance of Recommendation Letter", "Issuance of Medical Clearance for On-the-job-Training of Students", "Issuance of Student / Alumni Referral and Recommendation",
        // "Permission to Conduct an Activity", "Processing of Application for Change of Enrollment (Adding of Subject)", "Processing of Application for Change of Enrollment (Change of Schedule/Subject)",
        // "Processing of Application for Correction of Grade Entry, Late Reporting of Grades, & Incomplete Mark", "Processing of Application for Cross-Enrollment",
        // "Processing of Application for Shifting", "Processing of Course Accreditation Service for Transferees", "Processing of Freshman Admission", "Processing of Manual Enrollment", 
        // "Processing of Offsetting", "Processing of Online Petition of Subject", "Processing of Online Request for Tutorial of Subject", "Processing of Refunds",
        // "Processing of Req. for Credentials Service (Cert., Authentication, Verification (CAV/APOSTILLE))", "Processing of Request for Academic Verification Service",
        // "Processing of Request for Application for Graduation Service – SIS and Non-SIS", "Processing of Request for Certificate of Transfer Credential/Honorable Dismissal",
        // "Processing of Request for Certification (Grades, Bonafide Student, General Weighted Average)", "Processing of Request for Course Accreditation Service for Shiftees and Regular Students",
        // "Processing of Request for Credentials Service (Course/Subject Description)", "Processing of Request for Credentials Service (Transcript of Records)",
        // "Processing of Request for Informative Copy of Grades", "Processing of Request for Leave of Absence (LOA)", "Processing Req. for Corr. of Name in Conformity W/ PSA Cert. of Live Birth &/or Corr. of Name in SRS",
        // "Re-Admission (Returning Students)", "Request for Certificate of Good Moral Character", "Request for the Reservation of Campus Facility", "Request for Memorandum of Agreement for Internship",
        // "Processing of Payment for Completion of Incomplete Grades", "Others"
        // ],
        "Administrative Office": ["Others"],
        "Property Office": ["Acceptance of Returned Items", "Exclusively Use Supplies", "Issuance of Common-Use Supplies", "Issuance of Gate Pass", "Others"],
        "Records' Office": ["Others"],
        "Cultural Office": ["Others"],
        "Library Office": ["Processing of Borrowing of Library Materials", "Processing of Library Clearance", "Processing of Returning of Library Materials", "Processing of Visitors' Request for Library Use", "Others"],
        "Scholarship Office": ["Entrance Scholarship Services", "Issuance of Certification of No Scholarship Services", "Issuance of Certification Scholars' Record Services", "Issuance of Compliance Certificate", "Others"],
    };

    $('#request_Office').change(function() {
        const selectedOffice = $(this).val();
        const services = officeToServices[selectedOffice] || [];
        
        const serviceDropdown = $('#request_Service');
        serviceDropdown.empty();
        serviceDropdown.append(new Option('...', ''));
        
        services.forEach(service => {
            serviceDropdown.append(new Option(service, service));
        });
    });

    $('#request_Office').trigger('change');
});

getMNRequest = () => {
    const dt = $('#mn-request-datatable');

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getMNRequest',
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
                        const ticketnum = data.request_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let title = data.request_Title;
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getRequestInfoAndNavigate('${data.request_Number}')">${title}</h3>`;
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
                        let status = data.request_Status;
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
                    },
                },
            ],
            order: [[0, 'asc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};

getMYRequest = () => {
    const dt = $('#my-request-datatable');

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getMYRequest',
                contentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.request_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let title = data.request_Title;
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getRequestInfoAndNavigate('${data.request_Number}')">${title}</h3>`;
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
                        const name = data.request_Office;
                        return `${name}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        let status = data.request_Status;
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
                    },
                },
            ],
            order: [[5, 'desc']],
        });
    }
};

getSorted = () => {
    const dt = $('#mn-request-datatable').DataTable();

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
    });

    if (dt) {
        dt.destroy(); // Destroy existing instance

        $('#mn-request-datatable').DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/sortRequests', // Modified URL for sorting requests
                contentType: 'application/x-www-form-urlencoded',
                dataSrc: '',
                data: {
                    request_status: $('#request_status').val(), // Modified to match HTML select id
                    request_type: $('#request_type').val(), // Modified to match HTML select id
                    request_office: $('#request_office').val(), // Modified to match HTML select id
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
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const ticketnum = data.request_Number;
                        return `${ticketnum}`;
                    },
                },
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        let title = data.request_Title;
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getRequestInfoAndNavigate('${data.request_Number}')">${title}</h3>`;
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
                        let status = data.request_Status;
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
                    },
                },
            ],
            order: [[0, 'asc']],
            dom: '<"top"B>rt<"bottom"lip>'
        });
    }
};

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
                $('#request_office').html(null);
                $('#request_office').html(`<option value="${profiledata.admin_Office}">${profiledata.admin_Office}</option>`);
                $('#request_office').val(profiledata.admin_Office);
                $('#request_office').prop('disabled', true);
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