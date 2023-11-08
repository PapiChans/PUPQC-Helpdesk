$(function() {
    getResources();
})

const notyf = new Notyf();

// Get the Extention File
function getFileExtension(filename){
    const extension = filename.split('.').pop();
    return extension;
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
                url: '/api/student/getCampusResources',
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
                        return `<a href="${data.resources_File}" download="${data.resources_Name}"><button type="button" class="btn btn-primary waves-effect waves-light"><i class="fa-solid fa-file-download"></i> Download</button></a>`
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