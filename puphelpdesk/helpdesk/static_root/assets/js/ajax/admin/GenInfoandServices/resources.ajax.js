$(function() {
    $('#AddResourcesForm').on('submit', function (e) {
        e.preventDefault() 
        addResources(ResourcesFile)
        // prevent page refresh
    })
    getResources();
})

const notyf = new Notyf();

ResourcesFile = FilePond.create(document.querySelector('#resources_File'), {
    instantUpload: false,
    allowProcess: false,
})

// Get the Extention File
function getFileExtension(filename){
    const extension = filename.split('.').pop();
    return extension;
}

addResources = (ResourcesFile) => {
    if ($('#AddResourcesForm')[0]) {
        const form = new FormData($('#AddResourcesForm')[0])
        
        const resources_Name = $('#resources_Name').val();
        form.append('resources_Name', resources_Name);

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = ResourcesFile.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('resources_File', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0 || !resources_Name) {
            Swal.fire({
                title: 'Input Field/s is empty.',
                text: 'Please enter the file name and upload file.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#resources_Submit').prop('disabled', false);
        }
        else {
            form.append('resources_Name', resources_Name);

            notyf.open({
                message: 'Uploading File. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'POST',
                url: '/api/admin/addCampusResources',
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#resources_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Upload Campus Resources Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('form#AddResourcesForm')[0].reset();
                        $('#AddResourcesModal').modal('hide')
                            location.reload()

                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while uploading campus resources. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
                $('#resources_Submit').prop('disabled', false);
            })
        }
    }
}

getResources = () => {
    const dt = $('#resources-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getCampusResources',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    render: (data) => {
                        const filename = data.resources_Name
                        return `${filename}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const file = getFileExtension(data.resources_File).toUpperCase()
                        return `${file}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" onclick="downloadFile('${data.resources_File}', '${data.resources_Name}')"class="btn btn-info waves-effect waves-light"><i class="fa-solid fa-file-download"></i> Download</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteResources('${data.resources_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                `
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
    notyf.success({
        message: 'Resources Fetched.',
        position: {x:'right',y:'top'},
        duration: 2500
    })
}

// This Sets the file name of the File
function downloadFile(fileUrl, fileName) {
    // Fetch the file from the cross-origin source

    const sanitizedFileName = fileName.replace(/\./g, '');

    fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Set the download attribute with the encoded filename
            link.download = sanitizedFileName;

            // Append the link to the document
            document.body.appendChild(link);

            // Trigger a click on the link to start the download
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        })
        .catch(error => console.error('Error downloading file:', error));
}

deleteResources = (resources_Id) => {

    Swal.fire({
        title: 'Delete Resources',
        html: 'Are you sure do you want to delete the file of this campus resources?',
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
                url: `/api/admin/deleteCampusResources/${resources_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Resources Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting the file. Please try again.',
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