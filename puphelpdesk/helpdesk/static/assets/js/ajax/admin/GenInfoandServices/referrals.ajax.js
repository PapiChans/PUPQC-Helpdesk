$(function() {
    $('#AddReferralForm').on('submit', function (e) {
        addReferral()
        e.preventDefault() // prevent page refresh
    })
    getServiceRefferals();
    $('#EditReferralForm').on('submit', function (e) {
        editReferral()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addReferral = () => {
    if ($('#AddReferralForm')[0].checkValidity()) {
        const form = new FormData($('#AddServiceForm')[0]);
        
        const referral_Type = $('#referral_Type').val();
        const referral_Name = $('#referral_Name').val();
        const referral_Description = $('#referral_Description').val();
        const referral_More_Info = $('#referral_More_Info').val();

        const data = {
            referral_Type: referral_Type,
            referral_Name: referral_Name,
            referral_Description: referral_Description,
            referral_More_Info: referral_More_Info,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addServiceReferral',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#referral_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Service Referral Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddReferralForm')[0].reset();
                        $('#AddReferralsModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding service referral. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        })
    }
}

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
        url: '/api/admin/getServiceReferral',
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
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#referralInfoModal" onclick="getReferralInfo('${servicedata.referral_Id}')">Infomation</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#editReferralModal" onclick="foreditreferral('${servicedata.referral_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteServiceReferral('${servicedata.referral_Id}')">Delete</button>
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
        url: `/api/admin/getReferralInfo/${referral_Id}`,
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

foreditreferral = (referral_Id) => getServiceRefferalforEdit(referral_Id)

getServiceRefferalforEdit = (referral_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getReferralInfo/${referral_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const servicedata = result;
            $('#edit_referral_Id').val(servicedata.referral_Id);
            $('#edit_referral_Type').val(servicedata.referral_Type);
            $('#edit_referral_Name').val(servicedata.referral_Name);
            $('#edit_referral_Description').val(servicedata.referral_Description);
            $('#edit_referral_More_Info').val(servicedata.referral_More_Info);
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

editReferral = () => {
    if ($('#EditReferralForm')[0].checkValidity()) {
        const form = new FormData($('#EditReferralForm')[0]);
        
        const referral_Id = $('#edit_referral_Id').val();
        const referral_Type = $('#edit_referral_Type').val();
        const referral_Name = $('#edit_referral_Name').val();
        const referral_Description = $('#edit_referral_Description').val();
        const referral_More_Info = $('#edit_referral_More_Info').val();

        const data = {
            referral_Type: referral_Type,
            referral_Name: referral_Name,
            referral_Description: referral_Description,
            referral_More_Info: referral_More_Info,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editServiceReferral/${referral_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_referral_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Service Referral Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditReferralForm')[0].reset();
                        $('#editReferralModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving service referral. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        })
    }
}

deleteServiceReferral = (referral_Id) => {

    Swal.fire({
        title: 'Delete Service Referral',
        html: `Are you sure do you want to delete this Service Referral?`,
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: `/api/admin/deleteServiceReferral/${referral_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Service Referral Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting Service Referral. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
            })
        }
    })
}