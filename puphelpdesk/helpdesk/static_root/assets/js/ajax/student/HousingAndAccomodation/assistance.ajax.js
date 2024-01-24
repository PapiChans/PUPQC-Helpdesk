$(function() {
    getLivingAssistance();
});

const notyf = new Notyf();

getLivingAssistance = () => {
    let livingassistance_display = $('#livingassistance_display')

    notyf.open({
        message: 'Fetching Living Assistance',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getLivingAssistance',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const assistancedata = result;
            if (assistancedata.length > 0) {
                assistancedata.forEach((assistancedata) => {

                    let assistanceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${assistancedata.assistance_Name} [${assistancedata.assistance_Type}]</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${assistancedata.assistance_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" onclick="window.open('${assistancedata.assistance_Link}','_blank')">Living Assistance Link</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_LivingAssistance').html(null)
                        livingassistance_display.append(assistanceformat)
                });
                notyf.success({
                    message: 'All Living Assistance Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Living Assistance Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Living Assistance Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}