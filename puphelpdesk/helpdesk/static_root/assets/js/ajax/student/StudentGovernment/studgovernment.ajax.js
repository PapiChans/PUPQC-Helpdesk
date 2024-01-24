$(function() {
    getStudentGovernment();
});

const notyf = new Notyf();

getStudentGovernment = () => {
    let election_display = $('#election_display')
    let membership_display = $('#membership_display')

    notyf.open({
        message: 'Fetching Student Referrals',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getGovernment',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const governmentdata = result;
            if (governmentdata.length > 0) {
                governmentdata.forEach((governmentdata) => {

                    let governmentformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${governmentdata.government_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">Organization: <strong>${governmentdata.government_Name}</strong></p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#governmentInfoModal" onclick="getGovernmentInfo('${governmentdata.government_Id}')">Information</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    if (governmentdata.government_Type == 'Election'){
                        $('#no_election').html(null)
                        election_display.append(governmentformat)
                    }
                    if (governmentdata.government_Type == 'Membership'){
                        $('#no_membership').html(null)
                        membership_display.append(governmentformat)
                    }
                });
                notyf.success({
                    message: 'All Student Government Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Student Government  Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Student Government  Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getGovernmentInfo = (government_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getGovernmentInfo/${government_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const governmentdata = result;
            $('#government_Type_info').html(governmentdata.government_Type);
            $('#government_Title_info').html(governmentdata.government_Title);
            $('#government_Name_info').html(governmentdata.government_Name);
            $('#government_Role_info').html(governmentdata.government_Role);
            $('#government_Description_info').html(governmentdata.government_Description);
            $('#government_Qualification_info').html(governmentdata.government_Qualification);
            $('#government_Participation_info').html(governmentdata.government_Participation);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Student Government Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}