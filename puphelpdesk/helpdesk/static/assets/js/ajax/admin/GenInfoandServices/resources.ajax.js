$(function() {
    $('#AddResourcesForm').on('submit', function (e) {
        addResources(ResourcesFile)
        e.preventDefault() // prevent page refresh
    })

    getResources()
})

const notyf = new Notyf();

ResourcesFile = FilePond.create(document.querySelector('#resources_File'), {
    instantUpload: false,
    allowProcess: false,
})

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
        }
        else {
            notyf.open({
                message: 'Uploading File. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });

            form.append('resources_Name', resources_Name);
            
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
                            $('#AddResourcesModal').modal('hide');
                            $('form#AddResourcesForm')[0].reset();
                            setTimeout(function () {
                                location.reload()
                            }, 2600);
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
            dom:
				"<'row'<'col-xl-12 mb-2'B>>" +
				"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [

            ],
            bDestroy: true,
            ajax: {
                type: 'GET',
                url: '/api/admin/getCampusResources',
                ContentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const filename = data.resources_Name
                        return `${filename}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        const file = data.resources_File
                        return `${file}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    render: (data) => {
                        return `<button onclick="handleDownload('${data.resource_File}')">Download</button>`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}