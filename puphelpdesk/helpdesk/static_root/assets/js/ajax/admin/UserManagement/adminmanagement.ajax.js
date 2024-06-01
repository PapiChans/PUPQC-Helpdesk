$(function() {
    getFIS();
    getAdminManagement();
    $('#RegisterAdminForm').on('submit', function (e) {
        addAdmin()
        e.preventDefault() // prevent page refresh
    })
    $('#EditAdminForm').on('submit', function (e) {
        const profile_Id = $('#edit_profile_Id').val();
        editProfile(profile_Id)
        e.preventDefault() // prevent page refresh
    })
})

// For Registering Validations
document.addEventListener('DOMContentLoaded', function () {
    const masterAdminCheckbox = document.getElementById('is_master_admin');
    const technicianCheckbox = document.getElementById('is_technician');
    const officeField = document.getElementById('admin_Office');
    const facultyCodeField = document.getElementById('FacultyCode');
    const verifyButton = document.getElementById('verify_button');

    function updateFields() {
        if (masterAdminCheckbox.checked) {
            technicianCheckbox.disabled = true;
            technicianCheckbox.checked = false;
            officeField.innerHTML = '<option value="Master Admin">Master Admin</option>';
            officeField.disabled = true;
            facultyCodeField.disabled = true;
            verifyButton.disabled = true;
        } else {
            masterAdminCheckbox.disabled = false;
            technicianCheckbox.disabled = false;
            officeField.disabled = false;
            facultyCodeField.disabled = false;
            verifyButton.disabled = false;

            if (technicianCheckbox.checked) {
                masterAdminCheckbox.disabled = true;
                officeField.innerHTML = `
                    <option value="">Select Office</option>
                    <option value="Director's Office">Director's Office</option>
                    <option value="Academic Office">Academic Office</option>
                    <option value="Student Affairs and Service Office">Student Affairs and Service Office</option>
                    <option value="Registrar's Office">Registrar's Office</option>
                    <option value="Admission Office">Admission Office</option>
                    <option value="Cash and Disbursing Office">Cash and Disbursing Office</option>
                    <option value="Accounting Office">Accounting Office</option>
                    <option value="Scholarship Office">Scholarship Office</option>
                    <option value="Guidance and Placement Office">Guidance and Placement Office</option>
                    <option value="Administrative Office">Administrative Office</option>
                    <option value="Quality Assurance Center and OJT Office">Quality Assurance Center and OJT Office</option>
                    <option value="Research Office">Research Office</option>
                    <option value="Library (Resource Learning Center)">Library (Resource Learning Center)</option>
                    <option value="IT Laboratory Office">IT Laboratory Office</option>
                    <option value="Quality Management System Office">Quality Assurance Management Office</option>
                    <option value="Medical Clinic">Medical Clinic</option>
                    <option value="Security Office">Security Office</option>
                    <option value="Administrative Office">Administrative Office</option>
                    <option value="Property Office">Property Office</option>
                    <option value="Records' Office">Records' Office</option>
                    <option value="Cultural Office">Cultural Office</option>`;
                officeField.disabled = false;
                facultyCodeField.disabled = true;
                verifyButton.disabled = true;
            } else {
                officeField.innerHTML = `
                    <option value="">Select Office</option>
                    <option value="Director's Office">Director's Office</option>
                    <option value="Academic Office">Academic Office</option>
                    <option value="Student Affairs and Service Office">Student Affairs and Service Office</option>
                    <option value="Registrar's Office">Registrar's Office</option>
                    <option value="Admission Office">Admission Office</option>
                    <option value="Cash and Disbursing Office">Cash and Disbursing Office</option>
                    <option value="Accounting Office">Accounting Office</option>
                    <option value="Scholarship Office">Scholarship Office</option>
                    <option value="Guidance and Placement Office">Guidance and Placement Office</option>
                    <option value="Administrative Office">Administrative Office</option>
                    <option value="Quality Assurance Center and OJT Office">Quality Assurance Center and OJT Office</option>
                    <option value="Research Office">Research Office</option>
                    <option value="Library (Resource Learning Center)">Library (Resource Learning Center)</option>
                    <option value="IT Laboratory Office">IT Laboratory Office</option>
                    <option value="Quality Management System Office">Quality Assurance Management Office</option>
                    <option value="Medical Clinic">Medical Clinic</option>
                    <option value="Security Office">Security Office</option>
                    <option value="Administrative Office">Administrative Office</option>
                    <option value="Property Office">Property Office</option>
                    <option value="Records' Office">Records' Office</option>
                    <option value="Cultural Office">Cultural Office</option>`;
                facultyCodeField.disabled = false;
                verifyButton.disabled = false;
            }
        }
    }

    masterAdminCheckbox.addEventListener('change', updateFields);
    technicianCheckbox.addEventListener('change', updateFields);

    updateFields(); // Initialize field states on page load
});

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
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const username = data.username
                        return `${username}`
                    },
                },
                {
                    data: null,
                    class: 'text-left',
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
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const program = data.admin_Office
                        return `${program}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let program = data.is_master_admin
                        if (data.is_master_admin == true){
                            program = `<span class="badge bg-success text-info-fg">Yes</span>`
                        }
                        else{
                            program = `<span class="badge bg-danger text-info-fg">No</span>`
                        }
                        return `${program}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let program = data.is_technician
                        if (data.is_technician == true){
                            program = `<span class="badge bg-success text-info-fg">Yes</span>`
                        }
                        else{
                            program = `<span class="badge bg-danger text-info-fg">No</span>`
                        }
                        return `${program}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        let button = data.is_master_admin;
                        if (data.is_master_admin) {
                            button = '' 
                        }
                        else{
                            button = `<button type="button" class="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditAdminModal" onclick="getAdminInfo('${data.profile_Id}')"><i class="fa-solid fa-exclamation-circle"></i> Edit</button>`
                        }
                        return button;
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
        const technicianCheckbox = document.getElementById('is_technician');
        const isTechnician = technicianCheckbox.checked;

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
            isTechnician: isTechnician, 
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

getAdminInfo = (profile_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getOneAdminProfile/${profile_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (data) => {
            // Populate the form fields with the retrieved data
            $('#edit_Username').text(data.username); // Assuming username is retrieved from data
            $('#edit_profile_Id').val(data.profile_Id);

            // Populate the checkboxes based on the retrieved data
            $('#edit_is_master_admin').prop('checked', data.is_master_admin);
            $('#edit_is_technician').prop('checked', data.is_technician);

            // Handling office options and enabling/disabling checkboxes based on the conditions
            const officeOptions = `
                <option value="">Select Office</option>
                <option value="Director's Office">Director's Office</option>
                <option value="Academic Office">Academic Office</option>
                <option value="Student Affairs and Service Office">Student Affairs and Service Office</option>
                <option value="Registrar's Office">Registrar's Office</option>
                <option value="Admission Office">Admission Office</option>
                <option value="Cash and Disbursing Office">Cash and Disbursing Office</option>
                <option value="Accounting Office">Accounting Office</option>
                <option value="Scholarship Office">Scholarship Office</option>
                <option value="Guidance and Placement Office">Guidance and Placement Office</option>
                <option value="Administrative Office">Administrative Office</option>
                <option value="Quality Assurance Center and OJT Office">Quality Assurance Center and OJT Office</option>
                <option value="Research Office">Research Office</option>
                <option value="Library (Resource Learning Center)">Library (Resource Learning Center)</option>
                <option value="IT Laboratory Office">IT Laboratory Office</option>
                <option value="Quality Management System Office">Quality Management System Office</option>
                <option value="Medical Clinic">Medical Clinic</option>
                <option value="Security Office">Security Office</option>
                <option value="Property Office">Property Office</option>
                <option value="Records' Office">Records' Office</option>
                <option value="Cultural Office">Cultural Office</option>
            `;

            if (data.is_master_admin) {
                $('#edit_is_technician').prop('disabled', true);
                $('#edit_admin_Office').html(`<option value="${data.admin_Office}">${data.admin_Office}</option>`).val(data.admin_Office).prop('disabled', true);
            } else if (data.is_technician) {
                $('#edit_is_master_admin').prop('disabled', true);
                $('#edit_admin_Office').html(officeOptions).val(data.admin_Office).prop('disabled', false);
            } else {
                $('#edit_is_master_admin').prop('disabled', false);
                $('#edit_is_technician').prop('disabled', false);
                $('#edit_admin_Office').html(officeOptions).val(data.admin_Office).prop('disabled', false);
            }

            // Handling checkbox changes to enable/disable the other checkbox accordingly
            $('#edit_is_master_admin').change(function() {
                if (this.checked) {
                    $('#edit_is_technician').prop('checked', false).prop('disabled', true);
                    $('#edit_admin_Office').html(`<option value="${data.admin_Office}">${data.admin_Office}</option>`).prop('disabled', true);
                } else {
                    $('#edit_is_technician').prop('disabled', false);
                    $('#edit_admin_Office').html(officeOptions).val(data.admin_Office).prop('disabled', false);
                }
            });

            $('#edit_is_technician').change(function() {
                if (this.checked) {
                    $('#edit_is_master_admin').prop('checked', false).prop('disabled', true);
                    $('#edit_admin_Office').html(officeOptions).val(data.admin_Office).prop('disabled', false);
                } else {
                    $('#edit_is_master_admin').prop('disabled', false);
                    $('#edit_admin_Office').html(officeOptions).val(data.admin_Office).prop('disabled', false);
                }
            });

        },
        error: () => {
            notyf.error({
                message: 'Fetch Profile Error',
                position: { x: 'right', y: 'top' },
                duration: 2500
            });
        }
    });
}

editProfile = () => {
    if ($('#EditAdminForm')[0].checkValidity()) {
        const profile_Id = $('#edit_profile_Id').val();
        const technicianCheckbox = document.getElementById('edit_is_technician');
        const isTechnician = technicianCheckbox.checked;
        const admin_Office = $('#edit_admin_Office').val();

        const data = {
            is_technician: isTechnician,
            admin_Office: admin_Office,
        };

        $('#edit_Submit').prop('disabled', true);

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editAdminProfile/${profile_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    notyf.success({
                        message: 'Edit Profile Successfully',
                        position: { x: 'right', y: 'top' },
                        duration: 2500
                    });
                    $('#EditAdminForm')[0].reset();
                    location.reload();
                }
            },
            error: () => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while editing the admin profile. Please try again.',
                    icon: 'error',
                    allowEnterKey: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                });
                $('#edit_Submit').prop('disabled', false);
            }
        });
    }
}
