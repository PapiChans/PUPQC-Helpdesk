$(function() {
    getReplacing();
})

const notyf = new Notyf();

getReplacing = () => {
    let replacing_display = $('#replacing_display')

    notyf.open({
        message: 'Fetching Guide Steps',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getReplacingStep',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const guidedata = result;
            if (guidedata.length > 0) {
                guidedata.forEach((guidedata) => {

                    let guideformat = `
                    <div class="card mb-3">
                        <div class="card-status-start bg-primary"></div>
                        <div class="card-body">
                            <h3 class="card-title">Step ${guidedata.guide_Step_Number}: ${guidedata.guide_Title}</h3>
                            <p>${guidedata.guide_Text}</p>
                        </div>
                    </div>
                    `;

                    replacing_display.append(guideformat)

                });
                notyf.success({
                    message: 'Guide Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no-step').html(null);
            }
            else {
                notyf.success({
                    message: 'No Guide Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
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