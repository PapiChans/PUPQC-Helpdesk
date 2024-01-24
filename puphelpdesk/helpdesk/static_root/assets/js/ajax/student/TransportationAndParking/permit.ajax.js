$(function() {
    getPermit();
});

const notyf = new Notyf();

getPermit = () => {
    let permit_display = $('#permit_display')

    notyf.open({
        message: 'Fetching Parking Permit',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getPermit',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const permitdata = result;
            if (permitdata.length > 0) {
                permitdata.forEach((permitdata) => {

                    let permitformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${permitdata.permit_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${permitdata.permit_Info}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#permitInfoModal" onclick="getPermitInfo('${permitdata.permit_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_permit').html(null)
                        permit_display.append(permitformat)
                });
                notyf.success({
                    message: 'All Parking Permit Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Parking Permit Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Parking Permit Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getPermitInfo = (permit_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getPermitInfo/${permit_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const permitdata = result;

            $('#permit_Title_info').html(permitdata.permit_Title);
            $('#permit_Info_info').html(permitdata.permit_Info);
            $('#permit_Guide_info').html(permitdata.permit_Guide);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Permit Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}