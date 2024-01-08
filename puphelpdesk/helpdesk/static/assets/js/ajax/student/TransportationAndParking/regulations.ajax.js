$(function() {
    getRegulation();
});

const notyf = new Notyf();

getRegulation = () => {
    let regulation_display = $('#regulation_display')

    notyf.open({
        message: 'Fetching Parking Regulation',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getRegulation',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const regulationdata = result;
            if (regulationdata.length > 0) {
                regulationdata.forEach((regulationdata) => {

                    let regulationformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">${regulationdata.regulation_Title}</h3>
                            <p>${regulationdata.regulation_Info}</p>
                        </div>
                    </div>
                        `;

                        $('#no_regulation').html(null)
                        regulation_display.append(regulationformat)
                });
                notyf.success({
                    message: 'All Parking Regulation Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Parking Regulation Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Parking Regulation Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}