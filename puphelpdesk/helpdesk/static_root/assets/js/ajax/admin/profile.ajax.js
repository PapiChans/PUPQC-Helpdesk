$(function () {
    getadmininfo()
    const defaultContactValue = '09';
    
    // Set a default value for user_Contact when the page loads
    $('#admin_Contact').val(defaultContactValue);
    
    // Add an input event listener to user_Contact
    $('#admin_Contact').on('input', function() {
        // Check if the length is less than the length of the default value
        if ($(this).val().length < defaultContactValue.length) {
            // Set the value back to the default
            $(this).val(defaultContactValue);
        }
    });
    $('#EditProfileForm').on('submit', function (e) {
        editProfile()
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

$('input#admin_Contact').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use a regular expression to check if the value is a number
    return /^[0-9]+$/.test(value);
}

// Function to check if a value contains both numbers and characters
function containsNumbersAndChars(value) {
    // Use a regular expression to check if the value contains both numbers and characters
    return /[0-9]/.test(value) && /[a-zA-Z]/.test(value);
}

getadmininfo = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#admin_Last_Name').val(profiledata.admin_Last_Name);
            $('#admin_First_Name').val(profiledata.admin_First_Name);
            $('#admin_Middle_Name').val(profiledata.admin_Middle_Name);
            $('#admin_Email').html(profiledata.admin_Email);
            $('#admin_Contact').val(profiledata.admin_Contact);
            $('#admin_Gender').val(profiledata.admin_Gender);
            $('#profile_Id').val(profiledata.profile_Id)
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

editProfile = (profile_Id) => {
    if ($('#EditProfileForm')[0].checkValidity()) {
        const form = new FormData($('#EditProfileForm')[0]);

        $('#admin_Submit').prop('disabled', true);

        const profile_Id = $('#profile_Id').val();
        const admin_Last_Name = $('#admin_Last_Name').val();
        const admin_First_Name = $('#admin_First_Name').val();
        const admin_Middle_Name = $('#admin_Middle_Name').val();
        const admin_Contact = $('#admin_Contact').val();
        const admin_Gender = $('#admin_Gender').val();

        const data = {
            admin_Last_Name: admin_Last_Name,
            admin_First_Name: admin_First_Name,
            admin_Middle_Name: admin_Middle_Name,
            admin_Contact: admin_Contact,
            admin_Gender: admin_Gender,
        };
        if (!isValidNumber(admin_Contact)){
            $('#admin_Submit').prop('disabled', false);
            notyf.error({
                message: 'Contact field must enter numbers only.',
                position: {x:'right',y:'top'},
                duration: 2500
            })
        }
        else if (containsNumbersAndChars(admin_Last_Name) || containsNumbersAndChars(admin_First_Name) || containsNumbersAndChars(admin_Middle_Name)){
            $('#admin_Submit').prop('disabled', false);
            notyf.error({
                message: 'Name field/s should NOT Contains numbers',
                position: {x:'right',y:'top'},
                duration: 2500
            })
        }
        else {
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editprofile/${profile_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#admin_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Profile Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditProfileForm')[0].reset();
                            window.location.href = "/admin/dashboard";
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while editing admin profile Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#admin_Submit').prop('disabled', false);
            })
        }
    }
}