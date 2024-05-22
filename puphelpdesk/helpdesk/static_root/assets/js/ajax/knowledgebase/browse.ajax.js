$(function() {
    getFolder();
});

const notyf = new Notyf();

const dt = $('#topic-datatable').DataTable();

function truncateText(text, maxLength) {
    if (text && text.length > maxLength) { // Added null/undefined check for text
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function formatPostgresTimestamp(postgresTimestamp) {
    const date = new Date(postgresTimestamp);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

getFolder = () => {
    let folder_Display = $('#folder_Display');
    folder_Display.html(null);

    let main_Display = $('#main_Display');
    main_Display.html(null);

    let chosen_Display = $('#chosen_Display');
    chosen_Display.html(null);

    $.ajax({
        type: 'GET',
        url: '/api/guest/getKBFolder',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {
                    // Fetch topics count for each folder
                    fetchTopicCount(data.folder_Id, (topicCount) => {
                        let format = `
                            <a style="cursor: pointer;" class="list-group-item list-group-item-action" onclick="chosenFolder('${data.folder_Id}')">
                                ${truncateText(data.folder_Name, 20)} (${topicCount})
                            </a>
                        `;
                        folder_Display.append(format);
                    });
                });
            } else {
                notyf.success({
                    message: 'No Folder Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Folder Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    });
}

// Function to fetch topic count for a folder
fetchTopicCount = (folderId, callback) => {
    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBTopic/${folderId}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            // Assuming result is an array of topics
            const topicCount = result.length;
            callback(topicCount);
        },
    })
    .fail(() => {
        callback(0); // If fetching topic count fails, set count to 0
    });
}


// ----------------
// Knowledgebase Folder
// ----------------

chosenFolder = (folder_Id) => {
    let chosen_Display = $('#chosen_Display');
    chosen_Display.html(null);

    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBFolderInfo/${folder_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            // Pass the data in the form
            let format = `
                <div class="card card-link card-link-pop">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-folder" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                                </svg>
                            </div>
                            <div class="col-8">
                                <h3 class="text-primary">${data.folder_Name}</h3>
                            </div>
                            <div class="col-12">
                                <h4>${data.folder_Description}</h4>
                            </div> 
                        </div>
                    </div>
                </div>
                <h2 class="text-dark mt-2">Topics</h2>
            `;
            chosen_Display.append(format);

            // Update the DataTable with new data
            updateTable(data.folder_Id);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Folder Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    });
}

updateTable = (folder_Id) => {
    const dt = $('#topic-datatable').DataTable();
    dt.clear().destroy(); // Destroy the existing DataTable instance

    // Reinitialize the DataTable with new data
    getTable(folder_Id);
}

// ----------------
// Knowledgebase Topic
// ----------------

function getTopicInfoAndNavigate(topic_Number) {

    // Create the URL with the guide_Id parameter
    const detailsURL = `/knowledge/view?topic_Number=${topic_Number}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

getTable = (folder_Id) => {
    const dt = $('#topic-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: `/api/guest/getKBTopic/${folder_Id}`,
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        const name = data.topic_Name
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTopicInfoAndNavigate('${data.topic_Number}')">${truncateText(name, 50)}</h3>`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const author = data.created_by
                        return `${author}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        let badgestatus = data.status;
                        if (data.status == 'Draft'){
                            badgestatus = '<span class="badge bg-warning">Draft</span>'
                        }
                        if (data.status == 'Unpublished'){
                            badgestatus = '<span class="badge bg-danger">Unpublished</span>'
                        }
                        if (data.status == 'Published'){
                            badgestatus = '<span class="badge bg-success">Published</span>'
                        }
                        return `${badgestatus}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const date = data.date_Created
                        return `${formatPostgresTimestamp(date)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}