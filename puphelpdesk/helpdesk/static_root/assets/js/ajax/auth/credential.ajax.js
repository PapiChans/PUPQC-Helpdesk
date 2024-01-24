$(function () {
    logout = () => {
        notyf.success({
            message: 'Logging out...',
            position: {x:'right',y:'top'},
            duration: 2500
        }),

        $.ajax({
            type: 'GET',
            url: `/api/auth/logout`,
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                window.location.href = "/login";
            },
        })
        .fail(() => {
            notyf.error({
                message: 'Logout Error',
                position: {x:'right',y:'top'},
                duration: 2500
            });
        })
    }
})

