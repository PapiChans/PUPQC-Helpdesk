$(function () {
    $('#signupForm').submit(function (event) {
        signup()
        event.preventDefault();
    });
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
})

const notyf = new Notyf();

$('input#password').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-success",
    limitReachedClass: "badge bg-danger",
});

$('input#confirm_password').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-success",
    limitReachedClass: "badge bg-danger",
});

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

signup = () => {
    if ($('#signupForm')[0].checkValidity()) {
        const form = new FormData($('#signupForm')[0]);
        $('#signup_submit').prop('disabled', true);
        
        const username = $('#username').val();
        const password = $('#password').val();
        const confirm_password = $('#confirm_password').val();
        const user_Last_Name = $('#user_Last_Name').val();
        const user_First_Name = $('#user_First_Name').val();
        const user_Middle_Name = $('#user_Middle_Name').val();
        const user_Email = $('#user_Email').val();
        const user_Contact = $('#user_Contact').val();
        const user_Gender = $('#user_Gender').val();

        const data = {
            username: username,
            password: password,
            user_Last_Name: user_Last_Name,
            user_First_Name: user_First_Name,
            user_Middle_Name: user_Middle_Name,
            user_Email: user_Email,
            user_Contact: user_Contact,
            user_Gender: user_Gender,
        };

        if (password != confirm_password){
            $('#signup_submit').prop('disabled', false);
            notyf.error({
                message: 'Password does not match.',
                position: {x:'right',y:'top'},
                duration: 2500
            })
        }
        else if (containsNumbersAndChars(user_Last_Name) || containsNumbersAndChars(user_First_Name) || containsNumbersAndChars(user_Middle_Name)){
            $('#signup_submit').prop('disabled', false);
            notyf.error({
                message: 'Name field/s should NOT Contains numbers',
                position: {x:'right',y:'top'},
                duration: 2500
            })
        }
        else if (!isValidNumber(user_Contact)){
            $('#signup_submit').prop('disabled', false);
            notyf.error({
                message: 'Contact field must enter numbers only.',
                position: {x:'right',y:'top'},
                duration: 2500
            })
        }
        else {
        
            $.ajax({
                type: 'POST',
                url: '/api/auth/signup',
                data: data,
                dataType: 'json',
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        const signupdata = result;
                        if (signupdata.message == "User Already Exist"){
                            $('#signup_submit').prop('disabled', false);
                            notyf.error({
                                message: 'Username Already Exist',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                        }
                        else if (signupdata.message == "E-Mail Already Exist"){
                            $('#signup_submit').prop('disabled', false);
                            notyf.error({
                                message: 'E-Mail Already Exist',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                        }
                        else{
                            $('#signup_submit').prop('disabled', true);
                            notyf.success({
                                message: 'Signup Successfully.',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            })
                            window.location.href = "/login";
                        }
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while Signing up. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#signup_submit').prop('disabled', false);
            })
        }
    }
}
