$(function() {
    $('#AddJobPostingForm').on('submit', function (e) {
        addJobpost(CompanyLogo)
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

$('input#posting_Available_Position').maxlength({
    alwaysShow: true,
    warningClass: "badge bg-danger",
    limitReachedClass: "badge bg-success",
});

const ImageFileTypes = ['image/png', 'image/jpeg']

CompanyLogo = FilePond.create(document.querySelector('#posting_Logo'), {
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

// Function to check Null Fields
function hasNullOrEmptyValue(variables) {
    return variables.some(value => value === null || value.trim() === '');
}

// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use a regular expression to check if the value is a number
    return /^[0-9]+$/.test(value);
}

function addJobpost() {
    const form = new FormData($('#AddJobPostingForm')[0]);
        
        // const posting_Type = $('#posting_Type').val();
        const posting_Category = $('#posting_Category').val();
        const posting_Position = $('#posting_Position').val();
        const posting_Company = $('#posting_Company').val();
        const posting_Available_Position = $('#posting_Available_Position').val();
        const posting_Description = $('#posting_Description').val();
        const posting_Duties = $('#posting_Duties').val();
        const posting_Qualification = $('#posting_Qualifications').val();
        const posting_Requirements = $('#posting_Requirements').val();
        const posting_Skills = $('#posting_Skills').val();
        const posting_Location = $('#posting_Location').val();
        const posting_Contact = $('#posting_Contact').val();

        const formVariables = [
            // posting_Type,
            posting_Category,
            posting_Position,
            posting_Company,
            posting_Available_Position,
            posting_Description,
            posting_Duties,
            posting_Qualification,
            posting_Requirements,
            posting_Skills,
            posting_Location,
            posting_Contact
        ];

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
				form.append('posting_Logo', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0 || hasNullOrEmptyValue(formVariables)) {
            Swal.fire({
                title: 'Some of Input fields is Empty',
                text: 'Please upload Company logo and Enter required fields.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
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

                $('#posting_Submit').prop('disabled', true);
                // form.append('posting_Type', posting_Type);
                form.append('posting_Category', posting_Category);
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

                notyf.open({
                    message: 'Posting Job. Please Wait...',
                    position: {x:'right',y:'top'},
                    background: 'gray',
                    duration: 3000
                });
                
                $.ajax({
                    type: 'POST',
                    url: '/api/admin/addJobPosting',
                    data: form,
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers: {'X-CSRFToken': csrftoken},
                    success: function(result) {
                        if (result) {
                            $('#posting_Submit').prop('disabled', true);
                            notyf.success({
                                message: 'Job Post Successfully',
                                position: {x:'right',y:'top'},
                                duration: 2500
                            });
                            $('form#AddJobPostingForm')[0].reset();
            
                            setTimeout(function () {
                                window.location.href = `/admin/careers/internship`;
                            }, 2600);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr.responseText);
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Something went wrong while posting Job. Please try again.',
                            icon: 'error',
                            allowEnterKey: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        });
                        $('#posting_Submit').prop('disabled', false);
                    }
                });
            }
        }
    }