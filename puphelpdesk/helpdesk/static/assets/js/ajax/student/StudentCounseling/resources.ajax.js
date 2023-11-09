$(function() {
    getSuccessResources();
})

const notyf = new Notyf();

// Get the Extention File
function getFileExtension(filename){
    const extension = filename.split('.').pop();
    return extension;
}

getSuccessResources = () => {
    const dt = $('#success-resources-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/student/getSuccessResources',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    render: (data) => {
                        const filename = data.success_resources_Name
                        return `${filename}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        const file = getFileExtension(data.success_resources_File).toUpperCase()
                        return `${file}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<button type="button" onclick="downloadFile('${data.success_resources_File}', '${data.success_resources_Name}')"class="btn btn-primary waves-effect waves-light"><i class="fa-solid fa-file-download"></i> Download</button>
                                `
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
    notyf.success({
        message: 'Success Resources Fetched.',
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
