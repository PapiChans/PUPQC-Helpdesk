$(function() {
    $('#AddFacilityForm').on('submit', function (e) {
        addFacility(FacilityImage)
        e.preventDefault() // prevent page refresh
    })
    getFacility();
    $('#EditFacilityForm').on('submit', function (e) {
        editFacility()
        e.preventDefault() // prevent page refresh
    })
    $('#ReplaceFacilityImageForm').on('submit', function (e) {
        const facility_Id = $('#replace_facility_Id').val()
        replaceFacilityImage(ReplaceFacilityImage, facility_Id)
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

const ImageFileTypes = ['image/png', 'image/jpeg']

FacilityImage = FilePond.create(document.querySelector('#facility_Image'), {
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

addFacility = (FacilityImage) => {
    if ($('#AddFacilityForm')[0]) {
        const form = new FormData($('#AddFacilityForm')[0])
        
        const facility_Name = $('#facility_Name').val();
        const facility_Description = $('#facility_Description').val();

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = FacilityImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('facility_Image', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0 || !facility_Name || !facility_Description) {
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
            form.append('facility_Name', facility_Name);
            form.append('facility_Description', facility_Description);

            notyf.open({
                message: 'Adding Facility and Uploading Image. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addFacility',
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#facility_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Add Facility Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('form#AddFacilityForm')[0].reset();
                        $('#AddFacilitiesModal').modal('hide')

                        setTimeout(function () {
                            location.reload()
                        }, 2600);

                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while adding facility. Please try again.',
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

getFacility = () => {
    let display = $('#facility_Display')

    notyf.open({
        message: 'Fetching Facilities',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getFacility',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const facilitydata = result;
            if (facilitydata.length > 0) {
                facilitydata.forEach((facilitydata) => {
                    
                    let displayimage = facilitydata.facility_Image
                    if (displayimage) {
                        displayimage = facilitydata.facility_Image
                    }
                    else {
                        displayimage = '/static/assets/images/default-image/default-image-404.png'
                    }
                    
                    let facilityformat = ` 
                    <div class="col-xl-3 col-md-4 col-sm-6">
                        <div class="gallery-box mt-4">
                            <a class="gallery-popup glightbox font-weight-bold" href="${displayimage}" data-glightbox="title: ${facilitydata.facility_Name}; description: ${facilitydata.facility_Description}; descPosition: right;" >
                                <img class="gallery-demo-img img-fluid mx-auto" src="${displayimage}" alt="image" />
                                <div class="gallery-overlay">
                                    <div class="overlay-content">
                                        <h5 class="overlay-title">${facilitydata.facility_Name}</h5>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="text-center mt-2">
                            <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditFacilitiesModal" onclick="foreditfacility('${facilitydata.facility_Id}')"><i class="fa-solid fa-pencil"></i> Edit</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#ReplaceFacilityImageModal" onclick="foreditfacilityimage('${facilitydata.facility_Id}')"><i class="fa-solid fa-camera"></i> Replace</button>
                            <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteFacility('${facilitydata.facility_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </div>
                        `;

                        display.append(facilityformat)
                        
                });
                const lightbox = GLightbox({
                    touchNavigation: true,
                    openEffect: 'zoom',
                    closeEffect: 'zoom',
                });
                notyf.success({
                    message: 'All Facilities Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Facilities Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Display').html("No Facilities Data.");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Events Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

deleteFacility = (facility_Id) => {

    Swal.fire({
        title: 'Delete Facility',
        html: `Are you sure do you want to delete this facility?`,
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
                url: `/api/admin/deleteFacility/${facility_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Facility Successfully',
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
                    text: 'Something went wrong while deleting facility. Please try again.',
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

foreditfacility = (facility_Id) => getFacilityforEdit(facility_Id)

getFacilityforEdit = (facility_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getFacilityInfo/${facility_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const editFacilitydata = result;
            $('#edit_facility_Id').val(editFacilitydata.facility_Id);
            $('#edit_facility_Name').val(editFacilitydata.facility_Name);
            $('#edit_facility_Description').val(editFacilitydata.facility_Description);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Facility Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editFacility = (facility_Id) => {

    if ($('#EditFacilityForm')[0].checkValidity()) {
        const form = new FormData($('#EditFacilityForm')[0]);
        const facility_Id = $('#edit_facility_Id').val();
        const facility_Name = $('#edit_facility_Name').val();
        const facility_Description = $('#edit_facility_Description').val();

        const data = {
            facility_Name: facility_Name,
            facility_Description: facility_Description,
        };
    
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editFacility/${facility_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_facility_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Facility Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditFacilityForm')[0].reset();
                        $('#EditFacilitiesModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving changes. Please try again.',
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

ReplaceFacilityImage = FilePond.create(document.querySelector('#replace_facility_Image'), {
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

foreditfacilityimage = (facility_Id) => getFacilityforReplace(facility_Id)

getFacilityforReplace = (facility_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getFacilityInfo/${facility_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const editFacilitydata = result;
            $('#replace_facility_Id').val(editFacilitydata.facility_Id);
            $('#replace_facility_Name').html(editFacilitydata.facility_Name);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Facility Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

replaceFacilityImage = (ReplaceFacilityImage, facility_Id) => {
    if ($('#ReplaceFacilityImageForm')[0]) {
        const form = new FormData($('#ReplaceFacilityImageForm')[0])

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = ReplaceFacilityImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('replace_facility_Image', pondFiles[i].file)
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0) {
            Swal.fire({
                title: 'Upload Image is empty.',
                text: 'Please upload the Facility Image first.',
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
                url: `/api/admin/replaceFacilityImage/${facility_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    notyf.success({
                        message: 'Replace Facility Image Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#ReplaceFacilityImageForm')[0].reset();
                        $('#ReplaceFacilityImageModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while uploading and replacing the image in the facility. Please try again.',
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