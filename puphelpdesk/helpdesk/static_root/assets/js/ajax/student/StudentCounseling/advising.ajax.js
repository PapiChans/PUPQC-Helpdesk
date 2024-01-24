$(function() {
    getAdviser();
});

const notyf = new Notyf();

getAdviser = () => {
    let adviser_display = $('#adviser_display')

    notyf.open({
        message: 'Fetching Academic Adviser',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getAcademicAdviser',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const adviserdata = result;
            if (adviserdata.length > 0) {
                adviserdata.forEach((adviserdata) => {

                    let adviserformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${adviserdata.adviser_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Specialization: <strong>${adviserdata.adviser_Specialization}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#adviserInfoModal" onclick="getAcademicAdviserInfo('${adviserdata.adviser_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_Adviser').html(null)
                        adviser_display.append(adviserformat)
                });
                notyf.success({
                    message: 'All Academic Adviser Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Academic Adviser Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Academic Adviser Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getAcademicAdviserInfo = (adviser_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getAcademicAdviserInfo/${adviser_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const adviserdata = result;
            $('#adviser_Name_info').html(adviserdata.adviser_Name);
            $('#adviser_Contact_info').html(adviserdata.adviser_Contact);
            $('#adviser_Specialization_info').html(adviserdata.adviser_Specialization);
            $('#adviser_Reach_Out_info').html(adviserdata.adviser_Reach_Out);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Academic Adviser Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}