$(function() {
    getFIS();
    getAdminManagement();
    $('#RegisterAdminForm').on('submit', function (e) {
        addAdmin()
        e.preventDefault() // prevent page refresh
    })
})

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

const notyf = new Notyf();
getFIS = () => {
    const dt = $('#fis-datatable');

    $.ajaxSetup({
        headers: {
            'Authorization': 'API-Key',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJjNmYzMDFjZTg3OWE0M2YwOWMyZWYyZjUzODk1YjY1OSJ9.L0Xs2-s2hAhnOuUEyciVLPHOHDtH3OAeC_UgoMP3X64', // Replace '(TOKEN_VARIABLE)' with the actual token variable from your .env
        },     
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                url: 'https://pupqcfis-com.onrender.com/api/all/FISFaculty',
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                dataSrc: (result) => {
                    const formattedData = [];
                    if (result && result.Faculties) {
                        Object.keys(result.Faculties).forEach((facultyId) => {
                            const faculty = result.Faculties[facultyId];
                            formattedData.push({
                                LastName: faculty.LastName,
                                FirstName: faculty.FirstName,
                                Degree: faculty.Degree,
                                FacultyType: faculty.FacultyType,
                                Rank: faculty.Rank,
                                Units: faculty.Units,
                                PreferredSchedule: faculty.PreferredSchedule,
                                FacultyCode: faculty.FacultyCode,
                                Email: faculty.Email,
                                Specialization: faculty.Specialization,
                                Honorific: faculty.Honorific,
                                Status: faculty.Status,
                            });
                        });
                    }
                    return formattedData;
                },
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        return `${data.LastName}, ${data.FirstName}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<span class="badge bg-info text-info-fg">${data.FacultyType}</span>`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.PreferredSchedule}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Rank}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<span class="badge bg-secondary text-info-fg">${data.Units}</span>`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        let FStatus = null
                        if (data.Status == 'Active'){
                            FStatus = `<span class="badge bg-success text-info-fg">${data.Status}</span>`
                        }
                        else if (data.Status == 'Deactivated'){
                            FStatus = `<span class="badge bg-danger text-info-fg">${data.Status}</span>`
                        }
                        else if (data.Status == 'Disabled'){
                            FStatus = `<span class="badge bg-secondary text-info-fg">${data.Status}</span>`
                        }
                        else if (data.Status == 'Locked'){
                            FStatus = `<span class="badge bg-warning text-info-fg">${data.Status}</span>`
                        }
                        return FStatus;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.FacultyCode}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Specialization}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Honorific}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Degree}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${censorEmail(data.Email)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        });
    }
};

getFacultyData = () => {
    $('#verify_button').prop('disabled', true);
    $('#register_Submit').prop('disabled', true);
    $('#verify_button').html("Verifying...");

    const facultyCode = $('#FacultyCode').val();

    $.ajax({
        type: 'GET',
        url: 'https://pupqcfis-com.onrender.com/api/all/FISFaculty',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        cache: false,
        headers: {
            'Authorization': 'API-Key',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJjNmYzMDFjZTg3OWE0M2YwOWMyZWYyZjUzODk1YjY1OSJ9.L0Xs2-s2hAhnOuUEyciVLPHOHDtH3OAeC_UgoMP3X64',
        },
        success: (result) => {
            if (result && result.Faculties) {
                const faculties = result.Faculties;
                // Loop through each faculty's data to find a match
                for (const key in faculties) {
                    if (faculties.hasOwnProperty(key) && faculties[key].FacultyCode == facultyCode) {
                        // Faculty data found for the provided faculty code
                        const faculty = faculties[key];
                        $('#LastName').val(faculty.LastName);
                        $('#FirstName').val(faculty.FirstName);
                        $('#MiddleName').val(faculty.MiddleName);
                        $('#Gender').val(getGenderString(faculty.Gender));
                        $('#Contact').val(faculty.MobileNumber);
                        $('#Email').val(faculty.Email);
                        $('#register_Submit').prop('disabled', false);
                        return; // Exit the loop once a match is found
                    }
                }
                console.log("No Faculty data found for the provided code:", facultyCode);
            } else {
                // No data found at all
                console.log("No Faculty data found");
            }
        },
        error: (xhr, status, error) => {
            // Handle error
            console.error("Error occurred while fetching faculty data:", error);
        },
        complete: () => {
            // Re-enable the button and reset its text
            $('#verify_button').prop('disabled', false);
            $('#verify_button').html("Verify");
            $('#register_Submit').prop('disabled', false);
        }
    });
};

// Function to map gender value to string
function getGenderString(genderValue) {
    return genderValue == 1 ? "Male" : "Female";
}

getAdminManagement = () => {
    const dt = $('#admin-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getAdminManagement',
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
                        const name = data.admin_Last_Name + ", "+ data.admin_First_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const gender = data.admin_Gender
                        return `${gender}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const contact = data.admin_Contact
                        return `${censorContact(contact)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const email = data.admin_Email
                        return `${censorEmail(email)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const program = data.admin_Office
                        return `${program}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}

addAdmin = () => {
    if ($('#RegisterAdminForm')[0].checkValidity()) {
        const form = new FormData($('#RegisterAdminForm')[0]);

        $('#register_Submit').prop('disabled', true);
        
        const username = $('#username').val();
        const admin_Last_Name = $('#LastName').val();
        const admin_First_Name = $('#FirstName').val();
        const admin_Middle_Name = $('#MiddleName').val();
        const admin_Office = $('#admin_Office').val();
        const admin_Gender = $('#Gender').val();
        const admin_Contact = $('#Contact').val();
        const admin_Email = $('#Email').val();
        const masterAdminCheckbox = document.getElementById('is_master_admin');
        const isMasterAdmin = masterAdminCheckbox.checked;
        console.log("Is Master Admin:", isMasterAdmin);

        const data = {
            username: username,
            admin_Last_Name: admin_Last_Name,
            admin_First_Name: admin_First_Name,
            admin_Middle_Name: admin_Middle_Name,
            admin_Office: admin_Office,
            admin_Gender: admin_Gender,
            admin_Contact: admin_Contact,
            admin_Email: admin_Email,
            isMasterAdmin: isMasterAdmin,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addAdmin',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    if (result.code == 200) {
                        $('#register_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Admin Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#RegisterAdminForm')[0].reset();
                            $('#RegisterAdminModal').modal('hide');
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
                text: 'Something went wrong while adding Admin. Please try again.',
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