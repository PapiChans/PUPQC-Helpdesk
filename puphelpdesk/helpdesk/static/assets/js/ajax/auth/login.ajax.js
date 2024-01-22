$(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        login()
    });
})

login = () => {
    if ($('#loginForm')[0].checkValidity()) {
        const form = new FormData($('#loginForm')[0]);
        
        const username = $('#username').val();
        const password = $('#password').val();

        const data = {
            username: username,
            password: password,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/test/createuser',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#login_Submit').prop('disabled', true);
                    $('form#loginForm')[0].reset();
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
        })
    }
}
