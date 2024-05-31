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
                        return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTopicInfoAndNavigate('${data.topic_Number}')">${truncateText(name, 30)}</h3>`
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

searchKnowledge = () => {
    const dt = $('#topic-datatable');
    const knowledgeKeyword = $('#knowledge_Keyword').val().trim();

    if (!knowledgeKeyword) {
        $('#no_Knowledge').html("Keywords is Empty.");
        $('#knowledge_Search').prop('disabled', false);
        return;
    }

    $('#no_Knowledge').html("Searching...");
    $('#knowledge_Search').prop('disabled', true);

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken}
    });

    $.ajax({
        type: 'POST',
        url: `/api/guest/searchKnowledge/${knowledgeKeyword}`,
        data: JSON.stringify({knowledge_Keyword: knowledgeKeyword}), // Convert data to JSON string
        contentType: 'application/json', // Specify content type
        dataType: 'json', // Specify data type
        success: function(response) {
            $('#no_Knowledge').html(""); // Clear previous search message
            if (response.length === 0) {
                $('#no_Knowledge').html("No knowledge found.");
            } else {
                // Clear existing DataTable
                dt.DataTable().clear().destroy();
                // Reinitialize DataTable with new data and columns
                dt.DataTable({
                    data: response,
                    columns: [
                        { 
                            data: 'topic_Name', 
                            class: 'text-left', 
                            width: '10%',
                            render: function(data, type, row) {
                                const topicNumber = row.topic_Number;
                                return `<h3 style="cursor: pointer;" class="text-primary" onclick="getTopicInfoAndNavigate('${topicNumber}')">${truncateText(data, 25)}</h3>`;
                            }
                        },
                        { data: 'created_by', class: 'text-center', width: '10%' },
                        { 
                            data: 'status', 
                            class: 'text-center', 
                            width: '10%',
                            render: function(data) {
                                let badgestatus = '';
                                if (data == 'Draft'){
                                    badgestatus = '<span class="badge bg-warning">Draft</span>';
                                } else if (data == 'Unpublished'){
                                    badgestatus = '<span class="badge bg-danger">Unpublished</span>';
                                } else if (data == 'Published'){
                                    badgestatus = '<span class="badge bg-success">Published</span>';
                                }
                                return badgestatus;
                            }
                        },
                        { data: 'date_Created', class: 'text-center', width: '10%',
                          render: (data) => formatPostgresTimestamp(data)
                        }
                    ],
                    order: [[0, 'asc']]
                });
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
            $('#no_Knowledge').html("Error occurred while searching.");
        },
        complete: function() {
            $('#knowledge_Search').prop('disabled', false); // Enable search button after request completion
        }
    });
}