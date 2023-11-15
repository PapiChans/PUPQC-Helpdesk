$(function() {
    // Use event delegation for form submission
    $(document).on('submit', '#ReferralsForm', function(e) {
        addReferral();
        e.preventDefault(); // prevent page refresh
    });

    // Other functions and event bindings...
});

addReferral = () => {
    // Serialize form data correctly with FormData
    const form = $('#ReferralsForm')[0];
    const formData = new FormData(form);

    $.ajax({
        type: 'POST',
        url: '/api/admin/addReferral',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,  // important to prevent jQuery from transforming the data into a query string
        headers: {'X-CSRFToken': csrf_token},
        success: (result) => {
            if (result) {
                // Handle success, e.g., show a notification, reset the form, close the modal, etc.
                notyf.success({
                    message: 'Add Referral Successfully',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                form.reset();
                $('#AddReferralsModal').modal('hide');
                // Optionally, you can reload the page or update the referral list.
            }
        },
    })
    .fail(() => {
        // Handle failure, e.g., show an error message to the user.
        Swal.fire({
            title: 'Oops!',
            text: 'Something went wrong while adding the referral. Please try again.',
            icon: 'error',
            allowEnterKey: 'false',
            allowOutsideClick: 'false',
            allowEscapeKey: 'false',
            confirmButtonText: 'Okay',
            confirmButtonColor: '#D40429',
        });
    });
};
