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
                    if (logindata.response == "User does not exist"){
                        $('#login_submit').prop('disabled', false);
                        notyf.error({
                            message: 'User does not exist.',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    }
                    else if (logindata.response == "Incorrect Password") {
                        $('#login_submit').prop('disabled', false);
                        notyf.error({
                            message: 'Incorrect Password',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        setTimeout(function () {
                            location.reload();
                        }, 500);
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
