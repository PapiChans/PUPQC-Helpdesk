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

var sessionTimer;

checkSession = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/logout`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            if (result) {
                notyf.error({
                    message: 'Your session has expired due to inactivity about 15 minutes. Please log in again.',
                    position: {x:'right',y:'top'},
                    duration: 0,
                    icon: false,
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Check Session Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

// Function to reset the session timer
function resetSessionTimer() {
    // Clear the existing timer
    clearTimeout(sessionTimer);
    // Start a new timer 
    sessionTimer = setTimeout(checkSession, 900000); // 900000 milliseconds = 15 minutes
}

// Event listeners to reset the session timer on user activity
document.addEventListener('click', resetSessionTimer);

// Initial call to start the session timer
resetSessionTimer();