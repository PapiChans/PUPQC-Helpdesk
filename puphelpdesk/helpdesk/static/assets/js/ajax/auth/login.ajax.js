$(function () {
    $('#loginForm').submit(function (event) {
        login()
        event.preventDefault();
    });
})

login = () => {
    if ($('#loginForm')[0].checkValidity()) {
        const form = new FormData($('#loginForm')[0]);
        $('#login_submit').prop('disabled', true);
        
        const username = $('#username').val();
        const password = $('#password').val();

        const data = {
            username: username,
            password: password,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/auth/login',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    const logindata = result;
                    if (logindata.response == "User does not exist"){
                        $('#login_submit').prop('disabled', false);
                        Swal.fire({
                            title: 'Oops!',
                            text: 'The User does not exist',
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                    }
                    else if (logindata.response == "Incorrect Password") {
                        $('#login_submit').prop('disabled', false);
                        Swal.fire({
                            title: 'Oops!',
                            text: 'The password is incorrect',
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                    }
                    else {
                        $('#login_submit').prop('disabled', true);
                        if (logindata.admin == true){
                            window.location.href = "/admin/dashboard";
                        }
                        else if (logindata.admin == false) {
                            window.location.href = "/student/dashboard";
                        }
                    }
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while Loggin in. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#login_submit').prop('disabled', false);
        })
    }
}
