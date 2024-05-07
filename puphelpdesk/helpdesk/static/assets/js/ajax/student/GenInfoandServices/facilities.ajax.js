$(function() {
    getFacility();
})

const notyf = new Notyf();

lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'fadeDuration': 300,
    'imageFadeDuration': 300,
})

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

  getFacility = () => {
    let display = $('#facility_Display')

    $.ajax({
        type: 'GET',
        url: '/api/student/getFacility',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const facilitydata = result;
            if (facilitydata.length > 0) {
                facilitydata.forEach((facilitydata) => {
                    
                    let displayimage = facilitydata.facility_Image
                    if (displayimage) {
                        displayimage = facilitydata.facility_Image
                    }
                    else {
                        displayimage = '/static/assets/images/default-image/default-image-404.png'
                    }
                    
                    let facilityformat = ` 
                    <div class="col-md-4">
                        <div class="card">
                            <div class="img-responsive img-responsive-22x9 card-img-top" style="background-image: url(${displayimage})"></div>
                            <div class="card-body">
                                <h3 class="card-title text-center text-primary"><a href="${displayimage}" data-lightbox="facility">${facilitydata.facility_Name}</a></h3>
                                <p class="text-secondary">${truncateText(facilitydata.facility_Description, 100)}</p>
                            </div>
                        </div>
                    </div>
                        `;

                        display.append(facilityformat)
                        
                });

            }
            else {
                notyf.success({
                    message: 'No Facilities Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Display').html("No Facilities Data.");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Events Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}