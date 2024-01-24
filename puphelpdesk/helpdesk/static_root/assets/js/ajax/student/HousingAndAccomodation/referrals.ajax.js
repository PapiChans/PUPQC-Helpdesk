$(function() {
    getHousing();
})

const notyf = new Notyf();

getHousing = () => {
    let on_campus_display = $('#on_campus_display')
    let off_campus_display = $('#off_campus_display')

    notyf.open({
        message: 'Fetching Housing Options',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getHousingReferrals',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const housingdata = result;
            if (housingdata.length > 0) {
                housingdata.forEach((housingdata) => {

                    let housingformat = `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="img-responsive img-responsive-22x9 card-img-top" style="background-image: url(${housingdata.housing_Image})"></div>
                            <div class="card-body">
                                <h3 class="card-title">${housingdata.housing_Name}</h3>
                            </div>
                            <div class="card-footer">
                                <h4>Location: ${housingdata.housing_Location}</h4>
                            </div>
                        </div>
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#HousingInfoModal" onclick="getHousingInfo('${housingdata.housing_Id}')">Information</button>
                        </div>
                    </div>
                        `;

                    if (housingdata.housing_Type == 'On Campus'){
                        $('#no_on-campus').html(null)
                        on_campus_display.append(housingformat)
                    }
                    if (housingdata.housing_Type == 'Off Campus'){
                        $('#no_off-campus').html(null)
                        off_campus_display.append(housingformat)
                    }
                });
                notyf.success({
                    message: 'All Housing Options Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Housing Options',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Housing Options Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getHousingInfo = (housing_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getHousingReferralsInfo/${housing_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const housingdata = result;
            let type = housingdata.housing_Type
            if (housingdata.housing_Type === 'On Campus'){
                type = '<span class="badge bg-info text-info-fg">On-Campus</span>'
            }
            else if (housingdata.housing_Type === 'Off Campus') {
                type = `<span class="badge bg-info text-info-fg">Off-Campus</span>`
            }
            else {
                type = `<span class="badge bg-secondary text-secondary-fg">Unknown</span>`
            }
            $('#housing_Image_info').attr('src', `${housingdata.housing_Image}`);
            $('#housing_Type_info').html(type);
            $('#housing_Name_info').html(housingdata.housing_Name);
            $('#housing_Description_info').html(housingdata.housing_Description);
            $('#housing_Location_info').html(housingdata.housing_Location);
            $('#housing_Contact_info').html(housingdata.housing_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Housing Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}