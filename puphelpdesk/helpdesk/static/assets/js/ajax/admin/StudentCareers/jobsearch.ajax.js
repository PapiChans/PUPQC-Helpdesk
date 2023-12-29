$(function() {
    $('#AddJobSearchForm').on('submit', function (e) {
        addJobSearch()
        e.preventDefault() // prevent page refresh
    })
    getJobSearch();
    $('#EditJobSearchForm').on('submit', function (e) {
        editJobSearch()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addJobSearch = () => {
    if ($('#AddJobSearchForm')[0].checkValidity()) {
        const form = new FormData($('#AddJobSearchForm')[0]);
        
        const job_Search_Title = $('#job_Search_Title').val();
        const job_Search_Type = $('#job_Search_Type').val();
        const job_Search_Description = $('#job_Search_Description').val();
        const job_Search_Link = $('#job_Search_Link').val();

        const data = {
            job_Search_Title: job_Search_Title,
            job_Search_Type: job_Search_Type,
            job_Search_Description: job_Search_Description,
            job_Search_Link: job_Search_Link,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addJobSearch',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#job_Search_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Job Search Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddJobSearchForm')[0].reset();
                        $('#AddJobSearchModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Job Search Resources. Please try again.',
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
        url: '/api/admin/getJobSearch',
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
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditJobSearchModal" onclick="foreditjobsearch('${jobsearchdata.job_Search_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteJobSearch('${jobsearchdata.job_Search_Id}')">Delete</button>
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

foreditjobsearch = (job_Search_Id) => getJobSearchforEdit(job_Search_Id)

getJobSearchforEdit = (job_Search_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getJobSearchInfo/${job_Search_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const jobsearchdata = result;
            $('#edit_job_Search_Id').val(jobsearchdata.job_Search_Id);
            $('#edit_job_Search_Title').val(jobsearchdata.job_Search_Title);
            $('#edit_job_Search_Type').val(jobsearchdata.job_Search_Type);
            $('#edit_job_Search_Description').val(jobsearchdata.job_Search_Description);
            $('#edit_job_Search_Link').val(jobsearchdata.job_Search_Link);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Search Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editJobSearch = (job_Search_Id) => {
    if ($('#EditJobSearchForm')[0].checkValidity()) {
        const form = new FormData($('#EditJobSearchForm')[0]);
        
        const job_Search_Id = $('#edit_job_Search_Id').val();
        const job_Search_Title = $('#edit_job_Search_Title').val();
        const job_Search_Type = $('#edit_job_Search_Type').val();
        const job_Search_Description = $('#edit_job_Search_Description').val();
        const job_Search_Link = $('#edit_job_Search_Link').val();

        const data = {
            job_Search_Title: job_Search_Title,
            job_Search_Type: job_Search_Type,
            job_Search_Description: job_Search_Description,
            job_Search_Link: job_Search_Link,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editJobSearch/${job_Search_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_job_Search_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Job Search Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditJobSearchForm')[0].reset();
                        $('#EditJobSearchModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Job Search Resources. Please try again.',
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

deleteJobSearch = (job_Search_Id) => {

    Swal.fire({
        title: 'Delete Job Search Resources',
        html: `Are you sure do you want to delete this Job Search Resources?`,
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
                url: `/api/admin/deleteJobSearch/${job_Search_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Job Search Successfully',
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
                    text: 'Something went wrong while deleting Job Search Resources. Please try again.',
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