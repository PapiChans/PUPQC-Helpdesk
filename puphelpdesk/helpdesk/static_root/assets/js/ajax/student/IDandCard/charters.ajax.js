$(function () {
    getCharter();
})

const notyf = new Notyf();

function getCharterInfoAndNavigate(charterId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/user/charters/details?charter_number=${charterId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}


getCharter = () => {
    let charter_display = $('#charter_display')
    let charter_Category = 'Student ID Issuance'

    $.ajax({
        type: 'GET',
        url: `/api/student/getCharter/${charter_Category}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${data.charter_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${data.charter_Description.replace(/\n/g, '</p><p>')}</p>
                                <div class="text-center">
                                <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getCharterInfoAndNavigate('${data.charter_Number}')">View</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    charter_display.append(charterformat)

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Charter').html("No Charter Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}