$(function() {
    getHealthFacility();
});

const notyf = new Notyf();

getHealthFacility = () => {
    let healthservice_display = $('#healthservice_display')
    let medicalclinic_display = $('#medicalclinic_display')
    let wellnessprograms_display = $('#wellnessprograms_display')

    notyf.open({
        message: 'Fetching Health Facilities',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getHealthFacility',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const facilitydata = result;
            if (facilitydata.length > 0) {
                facilitydata.forEach((facilitydata) => {

                    let facilityformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${facilitydata.health_Facility_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${facilitydata.health_Facility_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#healthfacilityInfoModal" onclick="getHealthFacilityInfo('${facilitydata.health_Facility_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    if (facilitydata.health_Facility_Type == 'Health Service'){
                        $('#no_healthservice').html(null)
                        healthservice_display.append(facilityformat)
                    }
                    if (facilitydata.health_Facility_Type == 'Medical Clinic'){
                        $('#no_medicalclinic').html(null)
                        medicalclinic_display.append(facilityformat)
                    }
                    if (facilitydata.health_Facility_Type == 'Wellness Program'){
                        $('#no_wellnessprograms').html(null)
                        wellnessprograms_display.append(facilityformat)
                    }
                });
                notyf.success({
                    message: 'All Health Facility Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Health Facility Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Facility Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getHealthFacilityInfo = (health_Facility_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getHealthFacilityInfo/${health_Facility_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const healthdata = result;
            $('#health_Facility_Type_info').html(healthdata.health_Facility_Type);
            $('#health_Facility_Name_info').html(healthdata.health_Facility_Name);
            $('#health_Facility_Description_info').html(healthdata.health_Facility_Description);
            $('#health_Facility_Location_info').html(healthdata.health_Facility_Location);
            $('#health_Facility_Contact_info').html(healthdata.health_Facility_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Health Facility Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}