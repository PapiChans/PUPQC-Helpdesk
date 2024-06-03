$(function() {
    $('#EvaluationForm').on('submit', function (e) {
        submitRating()
        e.preventDefault() // prevent page refresh
    })
    verifyReferenceId()
})

const notyf = new Notyf();

// Initialize star rating plugin
var stars = new StarRating('.star-rating');

// Get the select element
var selectElement = document.querySelector('.star-rating');

// Listen for change event on select element
selectElement.addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue !== "") {
        console.log("Selected rating:", selectedValue);
        $('#rating_Submit').prop('disabled', false);
        // Here you can add any further validation or processing logic you need
    } else {
        console.log("Please select a rating");
        $('#rating_Submit').prop('disabled', true);
        // Here you can handle the case where no rating is selected
    }
});

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

    
    // Check if all radio button groups are filled out
    const radioGroups = ['Client', 'Gender', 'satisfaction_A', 'satisfaction_B', 'satisfaction_C', 'satisfaction_D', 'satisfaction_E', 'satisfaction_F', 'satisfaction_G', 'satisfaction_H'];
    const isRadioFilled = radioGroups.every(groupName => $('input[name="' + groupName + '"]:checked').length > 0);

    // Check form validity and radio button groups
    if ($('#EvaluationForm')[0].checkValidity() && isRadioFilled) {
        const form = new FormData($('#EvaluationForm')[0]);

        $('#eval_Submit').prop('disabled', true);
        
        // Prepare data for submission
        const data = {};
        form.forEach((value, key) => {
            data[key] = value;
        });

        const rating = $('#rating').val();
        const remarks = $('#remarks').val();
        data['rating'] = rating;
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
                $('#eval_Submit').prop('disabled', false);
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
    }
};
