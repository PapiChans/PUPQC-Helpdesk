$(function () {
    getCharter();
})

const notyf = new Notyf();

function formatPostgresTimestamp(postgresTimestamp) {
    const date = new Date(postgresTimestamp);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

function getCharterInfoAndNavigate(charterId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/student/charters/details?charter_number=${charterId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getCharter = () => {
    let charter_display = $('#charter_display')
    charter_display.html(null)
    $('#no_Charter').html("Loading...");

    $.ajax({
        type: 'GET',
        url: '/api/student/getCharter',
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
                    $('#no_Charter').html(null);

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

getCharterCategory = (selected_charter_Category) => {
    $('#no_Charter').html("Loading...");
    let charter_display = $('#charter_display')
    charter_display.html(null)
    let charter_Category = selected_charter_Category

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
                    $('#no_Charter').html(null);

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