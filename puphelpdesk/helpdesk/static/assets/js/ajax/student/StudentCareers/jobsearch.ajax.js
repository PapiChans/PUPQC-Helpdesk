$(function() {
    getJobSearch();
});

const notyf = new Notyf();

getJobSearch = () => {
    let jobsearch_display = $('#jobsearch_display')

    notyf.open({
        message: 'Fetching Job Search Resources',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getJobSearch',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const jobsearchdata = result;
            if (jobsearchdata.length > 0) {
                jobsearchdata.forEach((jobsearchdata) => {

                    let jobsearchformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${jobsearchdata.job_Search_Title} [${jobsearchdata.job_Search_Type}]</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${jobsearchdata.job_Search_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" onclick="window.open('${jobsearchdata.job_Search_Link}','_blank')">Job Resource Link</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_JobSearch').html(null)
                        jobsearch_display.append(jobsearchformat)
                });
                notyf.success({
                    message: 'All Job Search Resources Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Job Search Resources Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Search Resources Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}