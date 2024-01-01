$(function() {
    getHealthInsurance();
});

const notyf = new Notyf();

getHealthInsurance = () => {
    let healthinsurance_display = $('#healthinsurance_display')

    notyf.open({
        message: 'Fetching Health Insurance',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getHealthInsurance',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const insurancedata = result;
            if (insurancedata.length > 0) {
                insurancedata.forEach((insurancedata) => {

                    let insuranceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${insurancedata.health_Insurance_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Contact: <strong>${insurancedata.health_Insurance_Contact}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#healthinsuranceInfoModal" onclick="getHealthInsuranceInfo('${insurancedata.health_Insurance_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_HealthInsurance').html(null)
                        healthinsurance_display.append(insuranceformat)
                });
                notyf.success({
                    message: 'All Health Insurance Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Health Insurance Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Insurance Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getHealthInsuranceInfo = (health_Insurance_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getHealthInsuranceInfo/${health_Insurance_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#health_Insurance_Name_info').html(healthdata.health_Insurance_Name);
            $('#health_Insurance_Coverage_info').html(healthdata.health_Insurance_Coverage);
            $('#health_Insurance_Enrollment_info').html(healthdata.health_Insurance_Enrollment);
            $('#health_Insurance_Contact_info').html(healthdata.health_Insurance_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Insurance Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}