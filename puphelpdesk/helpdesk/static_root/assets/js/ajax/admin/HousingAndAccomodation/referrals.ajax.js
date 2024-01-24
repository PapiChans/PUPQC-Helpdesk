$(function() {
    $('#AddHousingForm').on('submit', function (e) {
        addHousing(HousingImage)
        e.preventDefault() // prevent page refresh
    })
    getHousing();
    $('#EditHousingForm').on('submit', function (e) {
        editHousing()
        e.preventDefault() // prevent page refresh
    })
    $('#ReplaceHousingImageForm').on('submit', function (e) {
        const housing_Id = $('#replace_housing_Id').val()
        replaceHousingImage(ReplaceHousingImage, housing_Id)
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

const ImageFileTypes = ['image/png', 'image/jpeg']

HousingImage = FilePond.create(document.querySelector('#housing_Image'), {
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

ReplaceHousingImage = FilePond.create(document.querySelector('#replace_housing_Image'), {
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

addHousing = (HousingImage) => {
    if ($('#AddHousingForm')[0]) {
        const form = new FormData($('#AddHousingForm')[0])
        
        const housing_Type = $('#housing_Type').val();
        const housing_Name = $('#housing_Name').val();
        const housing_Description = $('#housing_Description').val();
        const housing_Location = $('#housing_Location').val();
        const housing_Contact = $('#housing_Contact').val();

        const formVariables = [
            housing_Type,
            housing_Name,
            housing_Description,
            housing_Location,
            housing_Contact
        ]

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = HousingImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('housing_Image', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0 || hasNullOrEmptyValue(formVariables)) {
            Swal.fire({
                title: 'Input Field/s is empty.',
                text: 'Please enter input in blank fields and upload file.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
            form.append('housing_Type', housing_Type);
            form.append('housing_Name', housing_Name);
            form.append('housing_Description', housing_Description);
            form.append('housing_Location', housing_Location);
            form.append('housing_Contact', housing_Contact);

            notyf.open({
                message: 'Adding Housing and Uploading Image. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addHousingReferrals',
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#housing_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Housing Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('form#AddHousingForm')[0].reset();
                        $('#AddHousingModal').modal('hide')

                        setTimeout(function () {
                            location.reload()
                        }, 2600);

                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding Housing Referrals. Please try again.',
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
        url: '/api/admin/getHousingReferrals',
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
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#EditHousingModal" onclick="foredithousing('${housingdata.housing_Id}')">Edit</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#ReplaceHousingImageModal" onclick="forreplacehousingimage('${housingdata.housing_Id}')">Replace</button>
                            <button type="button" class="btn btn-danger waves-effect waves-light mb-2" onclick="deleteHousing('${housingdata.housing_Id}')">Delete</button>
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
        url: `/api/admin/getHousingReferralsInfo/${housing_Id}`,
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

foredithousing = (housing_Id) => getHousingforEdit(housing_Id)

getHousingforEdit = (housing_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHousingReferralsInfo/${housing_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const housingdata = result;
            $('#edit_housing_Id').val(housingdata.housing_Id);
            $('#edit_housing_Type').val(housingdata.housing_Type);
            $('#edit_housing_Name').val(housingdata.housing_Name);
            $('#edit_housing_Description').val(housingdata.housing_Description);
            $('#edit_housing_Location').val(housingdata.housing_Location);
            $('#edit_housing_Contact').val(housingdata.housing_Contact);
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

editHousing = (housing_Id) => {
    if ($('#EditHousingForm')[0].checkValidity()) {
        const form = new FormData($('#EditHousingForm')[0]);
        
        const housing_Id = $('#edit_housing_Id').val();
        const housing_Type = $('#edit_housing_Type').val();
        const housing_Name = $('#edit_housing_Name').val();
        const housing_Description = $('#edit_housing_Description').val();
        const housing_Location = $('#edit_housing_Location').val();
        const housing_Contact = $('#edit_housing_Contact').val();

        const data = {
            housing_Type: housing_Type,
            housing_Name: housing_Name,
            housing_Description: housing_Description,
            housing_Location: housing_Location,
            housing_Contact: housing_Contact,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editHousingReferrals/${housing_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_housing_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Housing Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditHousingForm')[0].reset();
                        $('#EditHousingModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Housing Options. Please try again.',
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

forreplacehousingimage = (housing_Id) => getHousingforReplace(housing_Id)

getHousingforReplace = (housing_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getHousingReferralsInfo/${housing_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const housingdata = result;
            $('#replace_housing_Id').val(housingdata.housing_Id);
            $('#replace_housing_Name').html(housingdata.housing_Name);
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

replaceHousingImage = (ReplaceHousingImage, housing_Id) => {
    if ($('#ReplaceHousingImageForm')[0]) {
        const form = new FormData($('#ReplaceHousingImageForm')[0])

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = ReplaceHousingImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('replace_housing_Image', pondFiles[i].file)
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0) {
            Swal.fire({
                title: 'Upload Image is empty.',
                text: 'Please upload the Image first.',
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
                url: `/api/admin/replaceHousingReferralsImage/${housing_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    notyf.success({
                        message: 'Replace Housing Image Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#ReplaceHousingImageForm')[0].reset();
                        $('#ReplaceHousingImageModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while replacing housing image. Please try again.',
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

deleteHousing = (housing_Id) => {

    Swal.fire({
        title: 'Delete Housing Referral',
        html: `Are you sure do you want to delete this Housing Referral?`,
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
                url: `/api/admin/deleteHousingReferrals/${housing_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Housing Referral Successfully',
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
                    text: 'Something went wrong while deleting Housing Referral. Please try again.',
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