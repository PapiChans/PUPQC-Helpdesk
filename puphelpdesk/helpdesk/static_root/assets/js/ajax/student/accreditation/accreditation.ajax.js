$(function() {
    getaccreditation();
})

const notyf = new Notyf();

getaccreditation = () => {
    let service_display = $('#service_display')

    notyf.open({
        message: 'Fetching Service',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: 'https://acmis.onrender.com/api/program-accreditation-records/?format=json',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();

            console.log(result)

            const servicedata = result;
            if (servicedata.length > 0) {
                servicedata.forEach((servicedata) => {

                    let serviceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${servicedata.description}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15"></p>
                            </div>
                        </div>
                    </div>
                        `;

                    service_display.append(serviceformat)

                });
                notyf.success({
                    message: 'Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
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