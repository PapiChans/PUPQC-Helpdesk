$(function () {
    getuserinfo()
    const defaultContactValue = '09';
    
    // Set a default value for user_Contact when the page loads
    $('#user_Contact').val(defaultContactValue);
    
    // Add an input event listener to user_Contact
    $('#user_Contact').on('input', function() {
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

$('input#user_Contact').maxlength({
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

getuserinfo = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            if (profiledata.user_Program == 'External Client') {
                let option = '<option value="External Client">External Client</option>'
                $('#user_Program').html(null);
                $('#user_Program').append(option);
            }
            $('#user_Program').val(profiledata.user_Program);
            $('#user_Last_Name').val(profiledata.user_Last_Name);
            $('#user_First_Name').val(profiledata.user_First_Name);
            $('#user_Middle_Name').val(profiledata.user_Middle_Name);
            $('#user_Email').html(profiledata.user_Email);
            $('#user_Contact').val(profiledata.user_Contact);
            $('#user_Gender').val(profiledata.user_Gender);
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

        $('#user_Submit').prop('disabled', true);

        //Clearing all the feedbacks
        $('#lname_feedback').html(null)
        $('#fname_feedback').html(null)
        $('#mname_feedback').html(null)
        $('#contact_feedback').html(null)

        const profile_Id = $('#profile_Id').val();
        const user_Program = $('#user_Program').val();
        const user_Last_Name = $('#user_Last_Name').val();
        const user_First_Name = $('#user_First_Name').val();
        const user_Middle_Name = $('#user_Middle_Name').val();
        const user_Contact = $('#user_Contact').val();
        const user_Gender = $('#user_Gender').val();

        const data = {
            user_Program: user_Program,
            user_Last_Name: user_Last_Name,
            user_First_Name: user_First_Name,
            user_Middle_Name: user_Middle_Name,
            user_Contact: user_Contact,
            user_Gender: user_Gender,
        };
        if (!isValidNumber(user_Contact)){
            $('#user_Submit').prop('disabled', false);
            notyf.error({
                message: 'Contact field must enter numbers only.',
                position: {x:'right',y:'top'},
                duration: 2500
            })
            $('#contact_feedback').html('It should contains only numbers')
        }
        else if (containsNumbersAndChars(user_Last_Name) || containsNumbersAndChars(user_First_Name) || containsNumbersAndChars(user_Middle_Name)){
            $('#user_Submit').prop('disabled', false);
            notyf.error({
                message: 'Name field/s should NOT Contains numbers',
                position: {x:'right',y:'top'},
                duration: 2500
            })
            if (containsNumbersAndChars(user_Last_Name)){
                $('#lname_feedback').html('It should NOT contains numbers/symbols')
            }
            if (containsNumbersAndChars(user_First_Name)){
                $('#fname_feedback').html('It should NOT contains numbers/symbols')
            }
            if (containsNumbersAndChars(user_Middle_Name)){
                $('#mname_feedback').html('It should NOT contains numbers/symbols')
            }
        }
        else {
            $.ajax({
                type: 'PUT',
                url: `/api/student/editprofile/${profile_Id}`,
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#user_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Profile Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                            $('form#EditProfileForm')[0].reset();
                            window.location.href = "/user/dashboard";
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while editing user profile Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#user_Submit').prop('disabled', false);
            })
        }
    }
}