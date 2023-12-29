$(function() {
    getCounseling();
});

const notyf = new Notyf();

getCounseling = () => {
    let counseling_display = $('#counseling_display')

    notyf.open({
        message: 'Fetching Career Counselors',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getCounseling',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const careerdata = result;
            if (careerdata.length > 0) {
                careerdata.forEach((careerdata) => {

                    let careerformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${careerdata.counseling_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Service: <strong>${careerdata.counseling_Service}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#counselingInfoModal" onclick="getCounselingInfo('${careerdata.counseling_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Counseling').html(null)
                        counseling_display.append(careerformat)
                });
                notyf.success({
                    message: 'All Career Counselors Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Career Counselors Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Career Counselors Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getCounselingInfo = (counseling_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getCounselingInfo/${counseling_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const careerdata = result;
            $('#counseling_Name_info').html(careerdata.counseling_Name);
            $('#counseling_Contact_info').html(careerdata.counseling_Contact);
            $('#counseling_Location_info').html(careerdata.counseling_Location);
            $('#counseling_Service_info').html(careerdata.counseling_Service);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Career Counselor Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}