$(function() {
    $('#EvaluationForm').on('submit', function (e) {
        submitRating()
        e.preventDefault() // prevent page refresh
    })
    verifyReferenceId()
})

const notyf = new Notyf();


function verifyReferenceId() {
    const refId = getRefIdFromURL();
    $.ajax({
        type: 'GET',
        url: `/api/verifyEvaluationID/${refId}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            console.log(result)
            if (result.code == 401){
                window.location.href = '/Unauthorized'
            }
            else if (result.code == 404){
                window.location.href = '/Not_Found'
            }
            else{
                
            }
        }
    })
}

function getRefIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eval_Reference');
}

submitRating = () => {

    $('#rating_Submit').prop('disabled', true);

    // Check if all radio button groups are filled out
    const radioGroups = ['Client', 'Gender', 'satisfaction_A', 'satisfaction_B', 'satisfaction_C', 'satisfaction_D', 'satisfaction_E', 'satisfaction_F', 'satisfaction_G', 'satisfaction_H'];
    const isRadioFilled = radioGroups.every(groupName => $('input[name="' + groupName + '"]:checked').length > 0);

    // Check form validity and radio button groups
    if ($('#EvaluationForm')[0].checkValidity() && isRadioFilled) {
        const form = new FormData($('#EvaluationForm')[0]);

        $('#rating_Submit').prop('disabled', true);
        
        // Prepare data for submission
        const data = {};
        form.forEach((value, key) => {
            data[key] = value;
        });

        const remarks = $('#remarks').val();
        data['remarks'] = remarks;

        console.log(data);

        // Perform AJAX request
        $.ajax({
            type: 'PUT',
            url: `/api/submitEvaluation/${getRefIdFromURL()}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#submitRating').prop('disabled', true);
                    notyf.success({
                        message: 'Rating submitted successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    });
                    $('form#EvaluationForm')[0].reset();
                    window.location.href = '/'
                }
            },
            error: () => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while submitting rating. Please try again.',
                    icon: 'error',
                    allowEnterKey: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                });
                $('#rating_Submit').prop('disabled', false);
            }
        });
    } else {
        // Show an error message indicating that all radio button groups must be filled out
        Swal.fire({
            title: 'Oops!',
            text: 'Please fill out all radio button groups before submitting.',
            icon: 'error',
            allowEnterKey: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Okay',
            confirmButtonColor: '#D40429',
        });
        $('#rating_Submit').prop('disabled', false);
    }
};
