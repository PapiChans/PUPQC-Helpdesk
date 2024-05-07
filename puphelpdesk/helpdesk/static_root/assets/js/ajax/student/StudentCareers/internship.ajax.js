$(function() {
    getJobPosts();
})

const notyf = new Notyf();

// Date Formatter
function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

getJobPosts = () => {
    let intern_display = $('#intern_display')
    let intern_archive_display = $('#intern_archive_display')

    notyf.open({
        message: 'Fetching Job and Internships',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getJobPosting',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const jobdata = result;
            if (jobdata.length > 0) {
                jobdata.forEach((jobdata) => {
                    const formattedDate = formatDate(jobdata.date_Created);
                    let cardcolor = null;

                    if (jobdata.job_Posting_Status == 'Active') {
                        cardcolor = 'info';
                    }
                    if (jobdata.job_Posting_Status == 'Archived') {
                        cardcolor = 'red';
                    }

                    let jobformat = `
                    <div class="col-md-4">
                    <div class="card">
                        <div class="img-responsive img-responsive-22x9 card-img-top" style="background-image: url(${jobdata.job_Logo})"></div>
                        <div class="card-body">
                            <h3 class="card-title">${jobdata.job_Posting_Position} [${jobdata.job_Available_Position}]</h3>
                            <p class="text-secondary">${jobdata.job_Posting_Category}</p>
                            <p class="text-secondary">${truncateText(jobdata.job_Description,100)}</p>
                        </div>
                        <div class="card-footer">
                            <h4 class="text-secondary">Posted: ${formattedDate}</h4>
                        </div>
                    </div>
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#JobInfoModal" onclick="getJobInfo('${jobdata.job_Posting_Id}')">Information</button>
                        </div>
                    </div>
                        `;

                        if (jobdata.job_Posting_Status == 'Active'){
                            $('#no_intern').html(null)
                            intern_display.append(jobformat)
                        }
                        if (jobdata.job_Posting_Status == 'Archived'){
                            $('#no_intern_archive').html('Archived Internships')
                            intern_archive_display.append(jobformat)
                        }
                });
                notyf.success({
                    message: 'All Jobs and Internships Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Jobs Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}


getJobInfo = (job_Posting_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getJobPostingInfo/${job_Posting_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const jobInfodata = result;
            let posted_Date = formatDate(jobInfodata.date_Created)
            let stat = jobInfodata.job_Posting_Status
            if (jobInfodata.job_Posting_Status === 'Active'){
                stat = '<span class="badge bg-success text-success-fg">Active</span>'
            }
            else if (jobInfodata.job_Posting_Status === 'Archived') {
                stat = `<span class="badge bg-red text-red-fg">Archived</span>`
            }
            else {
                stat = `<span class="badge bg-secondary text-secondary-fg">Unknown</span>`
            }
            $('#job_logo_info').attr('src', `${jobInfodata.job_Logo}`);
            // $('#job_type_info').html(jobInfodata.job_Posting_Type);
            $('#job_category_info').html(jobInfodata.job_Posting_Category);
            $('#job_position_info').html(jobInfodata.job_Posting_Position);
            $('#job_status_info').html(stat);
            $('#job_company_info').html(jobInfodata.job_Posting_Company);
            $('#job_available_position_info').html(jobInfodata.job_Available_Position);
            $('#job_description_info').html(jobInfodata.job_Description);
            $('#job_duties_info').html(jobInfodata.job_Duties);
            $('#job_qualifications_info').html(jobInfodata.job_Qualifications);
            $('#job_requirements_info').html(jobInfodata.job_Requirements);
            $('#job_skills_info').html(jobInfodata.job_Skills);
            $('#job_location_info').html(jobInfodata.job_Location);
            $('#job_contact_info').html(jobInfodata.job_Contact);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getJobCategory = (job_Posting_Category) => {
    $('#intern_display').html("Loading...");
    let job_display = $('#intern_display');
    job_display.html(null);
    let posting_Category = job_Posting_Category;

    $.ajax({
        type: 'GET',
        url: posting_Category ? `/api/student/getJobPosting/${posting_Category}` : '/api/student/getJobPosting',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((jobdata) => {
                    const formattedDate = formatDate(jobdata.date_Created);
                    let cardcolor = null;
                    if (jobdata.job_Posting_Status == 'Active') {
                        cardcolor = 'info';
                    }
                    if (jobdata.job_Posting_Status == 'Archived') {
                        cardcolor = 'red';
                    }
                    let jobformat = `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="img-responsive img-responsive-22x9 card-img-top" style="background-image: url(${jobdata.job_Logo})"></div>
                            <div class="card-body">
                                <h3 class="card-title">${jobdata.job_Posting_Position} [${jobdata.job_Available_Position}]</h3>
                                <p class="text-secondary">${jobdata.job_Posting_Category}</p>
                                <p class="text-secondary">${jobdata.job_Description}</p>
                            </div>
                            <div class="card-footer">
                                <h4 class="text-secondary">Posted: ${formattedDate}</h4>
                            </div>
                        </div>
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#JobInfoModal" onclick="getJobInfo('${jobdata.job_Posting_Id}')">Information</button>
                        </div>
                    </div>`;
                    job_display.append(jobformat)
                    $('#no_intern').html(null);
                });
            } else {
                notyf.success({
                    message: 'No Job Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_intern').html("No Internships Available");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    });
}
