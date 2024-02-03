$(function() {
    getService();
})

const notyf = new Notyf();

getService = () => {
    let service_display = $('#service_display')

    $.ajax({
        type: 'GET',
        url: '/api/student/getService',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const servicedata = result;
            if (servicedata.length > 0) {
                servicedata.forEach((servicedata) => {

                    let serviceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${servicedata.service_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${servicedata.service_Description}</p>
                            </div>
                        </div>
                    </div>
                        `;

                    service_display.append(serviceformat)

                });
            }
            else {
                notyf.success({
                    message: 'No Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Display').html("No Service Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}