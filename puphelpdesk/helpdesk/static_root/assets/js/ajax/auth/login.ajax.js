$(function () {
    $('#loginForm').submit(function (event) {
        login()
        event.preventDefault();
    });
})

const notyf = new Notyf();

$('input#password').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-success",
    limitReachedClass: "badge bg-danger",
});

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
                    if (logindata.code == 404){
                        Swal.fire({
                            title: 'Oops!',
                            text: 'User does not exist.',
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                        $('#login_submit').prop('disabled', false);
                    }
                    else if (logindata.code == 401) {
                        Swal.fire({
                            title: 'Oops!',
                            text: `Incorrect Password, Try again. Attempts Remaining: ${3-logindata.attempts}`,
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                        $('#login_submit').prop('disabled', false);
                    }
                    else if (logindata.code == 403) {
                        const remainingTimeSeconds = Math.ceil(logindata.time);
                        const remainingMinutes = Math.floor(remainingTimeSeconds / 60);
                        const remainingSeconds = remainingTimeSeconds % 60;
                        let remainingTimeMessage = '';
                        
                        if (remainingMinutes > 0) {
                            remainingTimeMessage += `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
                        }
                        
                        if (remainingSeconds > 0) {
                            remainingTimeMessage += ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
                        }
                        Swal.fire({
                            title: 'Account Temporarily Locked.',
                            text: `${logindata.response} Remaining Time: ${remainingTimeMessage}`,
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                        $('#login_submit').prop('disabled', false);
                    }
                    else {
                        $('#login_submit').prop('disabled', true);
                        if (logindata.admin == true){
                            window.location.href = "/admin/dashboard";
                        }
                        else if (logindata.admin == false) {
                            window.location.href = "/user/dashboard";
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
