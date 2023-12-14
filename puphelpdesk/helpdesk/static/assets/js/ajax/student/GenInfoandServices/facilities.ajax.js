$(function() {
    getFacility();
})

const notyf = new Notyf();

getFacility = () => {
    let display = $('#facility_Display')

    notyf.open({
        message: 'Fetching Facilities',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

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
                    <div class="col-xl-3 col-md-4 col-sm-6">
                        <div class="gallery-box mt-4">
                            <a class="gallery-popup glightbox font-weight-bold" href="${displayimage}" data-glightbox="title: <h3>${facilitydata.facility_Name}</h3>; description: <h5>${facilitydata.facility_Description}</h5>; descPosition: right;" >
                                <img class="gallery-demo-img img-fluid mx-auto" src="${displayimage}" alt="image" />
                            </a>
                        </div>
                    </div>
                        `;

                        display.append(facilityformat)
                        
                });
                const lightbox = GLightbox({
                    touchNavigation: true,
                    openEffect: 'zoom',
                    closeEffect: 'zoom',
                });
                notyf.success({
                    message: 'All Facilities Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
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