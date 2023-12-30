$(function() {
    getCounselor();
});

const notyf = new Notyf();

getCounselor = () => {
    let counselor_display = $('#counselor_display')

    notyf.open({
        message: 'Fetching Support Counselors',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getSupportCounselor',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const counselordata = result;
            if (counselordata.length > 0) {
                counselordata.forEach((counselordata) => {

                    let counselorformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${counselordata.counselor_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Specialization: <strong>${counselordata.counselor_Specialization}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#counselorInfoModal" onclick="getCounselorInfo('${counselordata.counselor_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Counselor').html(null)
                        counselor_display.append(counselorformat)
                });
                notyf.success({
                    message: 'All Support Counselors Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Support Counselors Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Support Counselors Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getCounselorInfo = (counselor_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getSupportCounselorInfo/${counselor_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const counselordata = result;
            $('#counselor_Name_info').html(counselordata.counselor_Name);
            $('#counselor_Contact_info').html(counselordata.counselor_Contact);
            $('#counselor_Specialization_info').html(counselordata.counselor_Specialization);
            $('#counselor_Reach_Out_info').html(counselordata.counselor_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Support Counselor Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}