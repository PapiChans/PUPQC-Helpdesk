$(function() {
    $('#EvaluationForm').on('submit', function (e) {
        submitRating()
        e.preventDefault() // prevent page refresh
    })
})

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

submitRating = () => {
    if ($('#EvaluationForm')[0].checkValidity()) {
        const form = new FormData($('#EvaluationForm')[0]);

        $('#eval_Submit').prop('disabled', true);
        
        const clientType = form.get('Client');
        const gender = form.get('Gender');
        const responsiveness = form.get('satisfaction_A');
        const reliability = form.get('satisfaction_B');
        const accessFacilities = form.get('satisfaction_C');
        const communication = form.get('satisfaction_D');
        const costs = form.get('satisfaction_E');
        const integrity = form.get('satisfaction_F');
        const assurance = form.get('satisfaction_G');
        const outcome = form.get('satisfaction_H');
        const rating = $('#rating').val(); // Get selected rating value
        const remarks = $('#remarks').val(); // Get remarks value


        const data = {
            clientType: clientType,
            gender: gender,
            responsiveness: responsiveness,
            reliability: reliability,
            accessFacilities: accessFacilities,
            communication: communication,
            costs: costs,
            integrity: integrity,
            assurance: assurance,
            outcome: outcome,
            rating: rating,
            remarks: remarks
        };

        console.log(data)
        
        $.ajax({
            type: 'POST',
            url: '/api/submitEvaluation',
            data: data,
            dataType: 'json',
            success: (result) => {
                if (result) {
                    $('#submitRating').prop('disabled', true);
                    notyf.success({
                        message: 'Rating submitted successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    });
                    $('form#EvaluationForm')[0].reset();
                    location.reload();
                }
            },
            error: () => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while submitting rating. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                });
                $('#eval_Submit').prop('disabled', false);
            }
        });
    }
};

