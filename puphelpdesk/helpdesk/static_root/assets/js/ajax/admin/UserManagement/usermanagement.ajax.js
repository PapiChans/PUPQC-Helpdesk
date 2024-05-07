$(function () {
    getUserManagement();
    getSPS();
    $('#RegisterStudentForm').on('submit', function (e) {
        addStudent()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

function censorEmail(email) {
    // Split the email address into local part and domain part
    var parts = email.split('@');
    var localPart = parts[0];
    var domainPart = parts[1];

    // Censor part of the local part
    var censoredLocalPart = localPart.substring(0, 1) + '*'.repeat(localPart.length - 2) + localPart.substring(localPart.length - 1);

    // Join the censored local part with the domain part
    var censoredEmail = censoredLocalPart + '@' + domainPart;

    return censoredEmail;
}

function censorContact(contact) {
    // Check if the contact number is a string
    if (typeof contact === 'string') {
        // Check if the contact number has 11 digits
        if (contact.length === 11) {
            // Replace all but the first and last two digits with '*'
            return contact.substring(0, 2) + '*'.repeat(7) + contact.substring(9);
        } else {
            // If the contact number doesn't have 11 digits, return as it is
            return contact;
        }
    } else {
        // If the input is not a string, return it as it is
        return contact;
    }
}

getSPS= () => {
    const dt = $('#sps-user-datatable');

    $.ajaxSetup({
		headers: {'X-API-Key': "1b20e3f9-8d44-45b7-96da-02e8001d73e8"},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: 'https://student-performance-1.onrender.com/api/v1/university-admin/student/?$skip=0&$top=400',
                contenttype: 'application/x-www-form-urlencoded',
                dataType: 'json',
                cache: false,
                headers: {'X-API-Key': "1b20e3f9-8d44-45b7-96da-02e8001d73e8"},
                dataSrc: (result) => {
                    const formattedData = [];
                    if (result && result.result) {
                        result.result.forEach((student) => {
                            formattedData.push({
                                LastName: student.LastName,
                                FirstName: student.FirstName,
                                Gender: student.Gender,
                                Contact: student.MobileNumber,
                                Email: student.Email,
                                Program: student.CourseCode,
                                StudentNumber: student.StudentNumber, // Include StudentNumber field
                            });
                        });
                    }
                    return formattedData;
                },                
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const studentnum = data.StudentNumber
                        return `${studentnum}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const Name = data.LastName + ", " + data.FirstName 
                        return `${Name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const Gender = data.Gender
                        return `${Gender}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const Contact = data.Contact
                        return `${censorContact(Contact)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const Email = data.Email
                        return `${censorEmail(Email)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const Program = data.Program
                        return `${Program}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}

getUserManagement = () => {
    const dt = $('#user-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getUserManagement',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const username = data.username
                        return `${username}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const name = data.user_Last_Name + ", "+ data.user_First_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const gender = data.user_Gender
                        return `${gender}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const contact = data.user_Contact
                        return `${censorContact(contact)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const email = data.user_Email
                        return `${censorEmail(email)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const program = data.user_Program
                        return `${program}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}


getStudentData = () => {
    $('#verify_button').prop('disabled', true);
    $('#register_Submit').prop('disabled', true);
    $('#verify_button').html("Verifying...");

    const studentNumber = $('#StudentNumber').val();

    $.ajax({
        type: 'GET',
        url: `https://student-performance-1.onrender.com/api/v1/university-admin/student/?$skip=0&$top=400`,
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        headers: {'X-API-Key': "1b20e3f9-8d44-45b7-96da-02e8001d73e8"},
        success: (result) => {
            if (result && result.result && result.result.length > 0) {
                // Loop through each student's data to find a match
                result.result.forEach(student => {
                    if (student.StudentNumber === studentNumber) {
                        // Student data found for the provided student number
                        $('#LastName').val(student.LastName);
                        $('#FirstName').val(student.FirstName);
                        $('#MiddleName').val(student.MiddleName);
                        $('#Program').val(student.CourseCode);
                        $('#Gender').val(student.Gender);
                        $('#Contact').val(student.MobileNumber);
                        $('#Email').val(student.Email);
                        $('#register_Submit').prop('disabled', false);
                        return; // Exit the loop once a match is found
                    }
                });
            } else {
                // No data found at all
                console.log("No student data found");
            }
        },
        error: (xhr, status, error) => {
            // Handle error
            console.error("Error occurred while fetching student data:", error);
        },
        complete: () => {
            // Re-enable the button and reset its text
            $('#verify_button').prop('disabled', false);
            $('#verify_button').html("Verify");
            $('#register_Submit').prop('disabled', false);
        }
    });
};

addStudent = () => {
    if ($('#RegisterStudentForm')[0].checkValidity()) {
        const form = new FormData($('#RegisterStudentForm')[0]);

        $('#register_Submit').prop('disabled', true);
        
        const username = $('#StudentNumber').val();
        const user_Last_Name = $('#LastName').val();
        const user_First_Name = $('#FirstName').val();
        const user_Middle_Name = $('#MiddleName').val();
        const user_Program = $('#Program').val();
        const user_Gender = $('#Gender').val();
        const user_Contact = $('#Contact').val();
        const user_Email = $('#Email').val();

        const data = {
            username: username,
            user_Last_Name: user_Last_Name,
            user_First_Name: user_First_Name,
            user_Middle_Name: user_Middle_Name,
            user_Program: user_Program,
            user_Gender: user_Gender,
            user_Contact: user_Contact,
            user_Email: user_Email,
            course_code: user_Program,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addStudent',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    if (result.code == 200) {
                        $('#register_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Student Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#RegisterStudentForm')[0].reset();
                            $('#RegisterStudentModal').modal('hide');
                                location.reload()
                    }
                    if (result.code == 403) {
                        notyf.success({
                            message: `${result.message}`,
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('#register_Submit').prop('disabled', false);
                    }
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Student. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#register_Submit').prop('disabled', false);
        })
    }
}