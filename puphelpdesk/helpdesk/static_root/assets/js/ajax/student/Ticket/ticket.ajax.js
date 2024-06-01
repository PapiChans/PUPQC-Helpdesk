$(function () {
    getTicket();
    getuserprofileforticket()
    $('#AddTicketForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        addTicket(CommentAttachment)
    })
})

$('input#ticket_Title').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
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

function getTicketInfoAndNavigate(ticketId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/user/ticket/view?ticket_number=${ticketId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getTicket = () => {
    const dt = $('#ticket-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getTicketbyUser',
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
                    render: (data) => {
                        const title = data.ticket_Title
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTicketInfoAndNavigate('${data.ticket_Number}')">${title}</h3>`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
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
                        const date = formatPostgresTimestamp(data.date_Created)
                        return `${date}`
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
                    }
                }                
            ],
            order: [[4, 'desc']],
        })
    }
}

getuserprofileforticket = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#ticket_full_Name').val(profiledata.user_Last_Name+", "+ profiledata.user_First_Name);
            $('#ticket_user_Id').val(profiledata.user_Id);
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

CommentAttachment = FilePond.create(document.querySelector('#comment_Attachment'), {
    instantUpload: false,
    allowProcess: false,
})

addTicket = (CommentAttachment) => {
    if ($('#AddTicketForm')[0].checkValidity()) {

        const form = new FormData($('#AddTicketForm')[0]);

        const user_Id = $('#ticket_user_Id').val();
        const full_Name = $('#ticket_full_Name').val();
        const sender_Affiliation = $('#sender_Affiliation').val();
        const ticket_Type = $('#ticket_Type').val();
        const ticket_Priority = $('#ticket_Priority').val();
        const ticket_Office = $('#ticket_Office').val(); // Added to get selected office
        const ticket_Title = $('#ticket_Title').val();
        const ticket_Service = $('#ticket_Service').val();
        const comment_Text = $('#comment_Text').val();
        
        if (
            form.get('filepond') == '' ||
            Object.prototype.toString.call(form.get('filepond')) === '[object File]'
        ) {
            form.delete('filepond');
        }

        pondFiles = CommentAttachment.getFiles();
        for (var i = 0; i < pondFiles.length; i++) {
            // append the blob file
            if (pondFiles[i].file != null) {
                form.append('comment_Attachment', pondFiles[i].file);
            }
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
                $('#ticket_Submit').prop('disabled', true);

                form.append('user_Id', user_Id);
                form.append('full_Name', full_Name);
                form.append('sender_Affiliation', sender_Affiliation);
                form.append('ticket_Type', ticket_Type);
                form.append('ticket_Priority', ticket_Priority);
                form.append('ticket_Office', ticket_Office);
                form.append('ticket_Title', ticket_Title);
                form.append('comment_Text', comment_Text);
                form.append('ticket_Service', ticket_Service);

                $.ajax({
                    type: 'POST',
                    url: '/api/student/addTicket',
                    data: form, // Pass FormData object directly
                    dataType: 'json',
                    contentType: false, // Ensure jQuery doesn't process the data
                    processData: false, // Prevent jQuery from automatically processing the data
                    headers: {'X-CSRFToken': csrftoken},
                    success: (response) => {
                        if (response.message === "Submit Ticket and Comment Successfully") { // Check the success message
                            notyf.success({
                                message: 'Ticket added successfully',
                                position: {x: 'right', y: 'top'},
                                duration: 2500
                            });
                            $('#ticket_Submit').prop('disabled', false);
                            $('#AddTicketModal').modal('hide'); // Close modal
                            $('#AddTicketForm')[0].reset(); // Clear form
                            // const dt = $('#ticket-datatable').DataTable();
                            // dt.clear().destroy(); // Destroy the existing DataTable instance
                            // getTicket(); // Reload data table
                            location.reload();
                        } else {
                            Swal.fire({
                                title: 'Oops!',
                                text: 'Something went wrong while submitting the ticket. Please try again.',
                                icon: 'error',
                                confirmButtonText: 'Okay',
                                confirmButtonColor: '#D40429',
                            });
                            $('#ticket_Submit').prop('disabled', false);
                        }
                    },
                    error: () => {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while submitting the ticket. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                        $('#ticket_Submit').prop('disabled', false);
                    }
                });
            }
        });
    }
};

$(document).ready(function() {
    const officeToServices = {
        "Director's Office": ["Permission to Conduct an Activity"],
        "Academic Office": ["Request for Certificate of Good Moral Character", "Processing of Online Request for Tutorial of Subject", "Application for Replacement of Lost Registration Certificate"],
        "Student Affairs and Service Office": ["Application for New Identification Card", "Application for Replacement of Lost Identification Card"],
        "Registrar's Office": ["Application for Overload of Subjects", "Processing of Req. for Credentials Service (Cert., Authentication, Verification (CAV/APOSTILLE))", "Processing of Request for Academic Verification Service"],
        "Admission Office": ["Re-Admission (Returning Students)", "Issuance of Follow-up of Students Referred during enrollment.", "Processing of Application for Correction of Grade Entry, Late Reporting of Grades, & Incomplete Mark", "Processing of Application for Change of Enrollment (Change of Schedule/Subject)", "Processing of Application for Change of Enrollment (Adding of Subject)", "Processing of Application for Cross-Enrollment", "Processing of Application for Shifting", "Processing of Course Accreditation Service for Transferees", "Processing of Freshman Admission", "Processing of Manual Enrollment", ],
        "Cash and Disbursing Office": ["Processing of Refunds"],
        "Accounting Office": ["Processing of Payment for Completion of Incomplete Grades"],
        "Quality Assurance Center and OJT Office": ["Request for Memorandum of Agreement for Internship"],
        "IT Laboratory Office": ["Request for the Reservation of Campus Facility", "Service 28"],
        "Medical Clinic": ["Issuance of Dental Clearance", "Issuance of Annual Medical Clearance", "Consultation and Treatment Services for Emergency Dental Cases of Students", "Consultation and Treatment Services for Emergency Dental Cases of Faculty and Admin. Employees", "Issuance of Medical Certificate for Sick Note/Excuse Slip", "Issuance of Medical Clearance for Enrollment", "Issuance of Medical Clearance for Laboratory Classes for Food-Handlers", "Issuance of Medical Clearance for Off-Campus of Students", "Issuance of Medical Clearance for On-the-job-Training of Students"],
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
        "Property Office": ["Others"],
        "Records' Office": ["Others"],
        "Cultural Office": ["Others"],
    };

    $('#ticket_Office').change(function() {
        const selectedOffice = $(this).val();
        const services = officeToServices[selectedOffice] || [];
        
        const serviceDropdown = $('#ticket_Service');
        serviceDropdown.empty();
        serviceDropdown.append(new Option('...', ''));
        
        services.forEach(service => {
            serviceDropdown.append(new Option(service, service));
        });
    });

    $('#ticket_Office').trigger('change');
});
