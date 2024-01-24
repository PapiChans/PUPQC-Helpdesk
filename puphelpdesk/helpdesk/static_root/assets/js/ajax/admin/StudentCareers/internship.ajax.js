$(function() {
    getJobPosts();
    $('#EditJobPostForm').on('submit', function (e) {
        editJobpost()
        e.preventDefault() // prevent page refresh
    })
    $('#ReplaceCompanyLogoForm').on('submit', function (e) {
        const job_Posting_Id = $('#replace_posting_Id').val()
        replaceCompanyLogo(CompanyLogo, job_Posting_Id)
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

// Date Formatter
function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use a regular expression to check if the value is a number
    return /^[0-9]+$/.test(value);
}

getJobPosts = () => {
    let job_display = $('#job_post_display')
    let job_archive_display = $('#job_archive_display')
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
        url: '/api/admin/getJobPosting',
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
                            <p class="text-secondary">${jobdata.job_Description}</p>
                        </div>
                        <div class="card-footer">
                            <h4 class="text-secondary">Posted: ${formattedDate}</h4>
                        </div>
                    </div>
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#JobInfoModal" onclick="getJobInfo('${jobdata.job_Posting_Id}')">Information</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#JobInfoEditModal" onclick="foreditjobpost('${jobdata.job_Posting_Id}')">Edit</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#ReplaceCompanyLogoModal" onclick="forreplacelogo('${jobdata.job_Posting_Id}')">Replace</button>
                            <button type="button" class="btn btn-danger waves-effect waves-light mb-2" onclick="deleteJobPost('${jobdata.job_Posting_Id}')">Delete</button>
                        </div>
                    </div>
                        `;

                    if (jobdata.job_Posting_Status == 'Active' && jobdata.job_Posting_Type == 'Job'){
                        $('#no_job').html(null)
                        job_display.append(jobformat)
                    }
                    if (jobdata.job_Posting_Status == 'Archived' && jobdata.job_Posting_Type == 'Job'){
                        $('#no_job_archive').html('Archived Jobs')
                        job_archive_display.append(jobformat)
                    }
                    if (jobdata.job_Posting_Status == 'Active' && jobdata.job_Posting_Type == 'Internship'){
                        $('#no_intern').html(null)
                        intern_display.append(jobformat)
                    }
                    if (jobdata.job_Posting_Status == 'Archived' && jobdata.job_Posting_Type == 'Internship'){
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
        url: `/api/admin/getJobPostingInfo/${job_Posting_Id}`,
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
            $('#job_type_info').html(jobInfodata.job_Posting_Type);
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

foreditjobpost = (job_Posting_Id) => getJobPostforEdit(job_Posting_Id)

getJobPostforEdit= (job_Posting_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getJobPostingInfo/${job_Posting_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const jobInfodata = result;
            $('#edit_posting_Id').val(jobInfodata.job_Posting_Id);
            $('#edit_posting_Type').val(jobInfodata.job_Posting_Type);
            $('#edit_posting_Position').val(jobInfodata.job_Posting_Position);
            $('#edit_posting_Company').val(jobInfodata.job_Posting_Company);
            $('#edit_posting_Available_Position').val(jobInfodata.job_Available_Position);
            $('#edit_posting_Description').val(jobInfodata.job_Description);
            $('#edit_posting_Duties').val(jobInfodata.job_Duties);
            $('#edit_posting_Qualifications').val(jobInfodata.job_Qualifications);
            $('#edit_posting_Requirements').val(jobInfodata.job_Requirements);
            $('#edit_posting_Skills').val(jobInfodata.job_Skills);
            $('#edit_posting_Location').val(jobInfodata.job_Location);
            $('#edit_posting_Contact').val(jobInfodata.job_Contact);
            $('#edit_posting_Status').val(jobInfodata.job_Posting_Status);
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

editJobpost = (job_Posting_Id) => {
    if ($('#EditJobPostForm')[0]) {
        const form = new FormData($('#EditJobPostForm')[0])
        
        const job_Posting_Id = $('#edit_posting_Id').val();
        const posting_Type = $('#edit_posting_Type').val();
        const posting_Position = $('#edit_posting_Position').val();
        const posting_Company = $('#edit_posting_Company').val();
        const posting_Available_Position = $('#edit_posting_Available_Position').val();
        const posting_Description = $('#edit_posting_Description').val();
        const posting_Duties = $('#edit_posting_Duties').val();
        const posting_Qualification = $('#edit_posting_Qualifications').val();
        const posting_Requirements = $('#edit_posting_Requirements').val();
        const posting_Skills = $('#edit_posting_Skills').val();
        const posting_Location = $('#edit_posting_Location').val();
        const posting_Contact = $('#edit_posting_Contact').val();
        const posting_Status = $('#edit_posting_Status').val();

        if (!isValidNumber(posting_Available_Position)){
            Swal.fire({
                title: 'Something went wrong',
                text: 'Available Position field must enter numbers only.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
            form.append('posting_Type', posting_Type);
            form.append('posting_Position', posting_Position);
            form.append('posting_Company', posting_Company);
            form.append('posting_Available_Position', posting_Available_Position);
            form.append('posting_Description', posting_Description);
            form.append('posting_Duties', posting_Duties);
            form.append('posting_Qualification', posting_Qualification);
            form.append('posting_Requirements', posting_Requirements);
            form.append('posting_Skills', posting_Skills);
            form.append('posting_Location', posting_Location);
            form.append('posting_Contact', posting_Contact);
            form.append('posting_Status', posting_Status);

            notyf.open({
                message: 'Saving Job. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'PUT',
                url: `/api/admin/editJobPosting/${job_Posting_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#edit_posting_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Edit Job Post Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('form#EditJobPostForm')[0].reset();
                        $('#JobInfoEditModal').modal('hide');

                        setTimeout(function () {
                            location.reload()
                        }, 2600);

                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while saving Job. Please try again.',
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
}

const ImageFileTypes = ['image/png', 'image/jpeg']

CompanyLogo = FilePond.create(document.querySelector('#replace_posting_Logo'), {
    instantUpload: false,
    allowProcess: false,
    acceptedFileTypes: ImageFileTypes,
    beforeAddFile: (file) => {
        // Check if the file type is not accepted
        if (!ImageFileTypes.includes(file.fileType)) {
            // Show an error message
            // * Sweetalert2 that will say: JPG, and PNG files are allowed
            Swal.fire({
                title: 'Something went wrong',
                text: `The file format you uploaded is ${file.fileType}`,
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            // Reject the file
            return false
        }
        // Continue with the file upload
        return true
    },
})

forreplacelogo = (job_Posting_Id) => getJobPostforReplaceLogo(job_Posting_Id)

getJobPostforReplaceLogo = (job_Posting_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getJobPostingInfo/${job_Posting_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const jobInfodata = result;
            $('#replace_posting_Id').val(jobInfodata.job_Posting_Id);
            $('#replace_posting_Position').html(jobInfodata.job_Posting_Position);
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

replaceCompanyLogo = (CompanyLogo, job_Posting_Id) => {
    if ($('#ReplaceCompanyLogoForm')[0]) {
        const form = new FormData($('#ReplaceCompanyLogoForm')[0])

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = CompanyLogo.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('replace_posting_Logo', pondFiles[i].file)
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0) {
            Swal.fire({
                title: 'Upload Image is empty.',
                text: 'Please upload the Company Logo first.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
            notyf.open({
                message: 'Uploading Image. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'PUT',
                url: `/api/admin/replaceCompanyLogo/${job_Posting_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    notyf.success({
                        message: 'Replace Company Logo Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#ReplaceCompanyLogoForm')[0].reset();
                        $('#ReplaceCompanyLogoModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while replacing company logo. Please try again.',
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
}

deleteJobPost = (job_Posting_Id) => {

    Swal.fire({
        title: 'Delete Job Post',
        html: `Are you sure do you want to delete this Job Post?`,
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
                url: `/api/admin/deleteJobPosting/${job_Posting_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Job Post Successfully',
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
                    text: 'Something went wrong while deleting Job Post. Please try again.',
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