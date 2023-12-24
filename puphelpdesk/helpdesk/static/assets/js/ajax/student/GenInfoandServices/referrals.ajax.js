$(function() {
    getServiceRefferals();
});

const notyf = new Notyf();

getServiceRefferals = () => {
    let oncampus_display = $('#oncampus_display')
    let community_display = $('#community_display')

    notyf.open({
        message: 'Fetching Service Referrals',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getServiceReferral',
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
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${servicedata.referral_Name}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${servicedata.referral_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#referralInfoModal" onclick="getReferralInfo('${servicedata.referral_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    if (servicedata.referral_Type == 'On Campus'){
                        $('#no_oncampus').html(null)
                        oncampus_display.append(serviceformat)
                    }
                    if (servicedata.referral_Type == 'Community'){
                        $('#no_community').html(null)
                        community_display.append(serviceformat)
                    }
                });
                notyf.success({
                    message: 'All Service Referrals Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Service Refferals Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Referrals Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getReferralInfo = (referral_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getReferralInfo/${referral_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const servicedata = result;
            let type = servicedata.referral_Type
            if (servicedata.referral_Type === 'On Campus'){
                type = '<span class="badge bg-success text-success-fg">On Campus</span>'
            }
            else if (servicedata.referral_Type === 'Community') {
                type = `<span class="badge bg-success text-success-fg">Community</span>`
            }
            else {
                type = `<span class="badge bg-secondary text-secondary-fg">Unknown</span>`
            }
            $('#referral_type_info').html(type);
            $('#referral_name_info').html(servicedata.referral_Name);
            $('#referral_description_info').html(servicedata.referral_Description);
            $('#referral_more_info').html(servicedata.referral_More_Info);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Referral Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}