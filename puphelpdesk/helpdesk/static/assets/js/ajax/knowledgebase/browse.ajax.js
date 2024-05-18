$(function() {
    // Call the function when the page loads to check the URL
    getCategoryOrFolderFromURL();
    getCategory();
});

const notyf = new Notyf();

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
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

function getCategoryOrFolderFromURL() {
    // Get the search portion of the URL
    const searchParamsString = window.location.search;

    // Create a URLSearchParams object with the search string
    const searchParams = new URLSearchParams(searchParamsString);

    // Check if the URL contains 'category_Name' or 'folder_Name' query parameter
    if (searchParams.has('category_Name')) {
        const categoryName = searchParams.get('category_Name');
        chosenCategory(categoryName); // Trigger function for category
    } else if (searchParams.has('folder_Name')) {
        const folderName = searchParams.get('folder_Name');
        getFolderbyName(folderName); // Trigger function for folder
    } else {
        // Neither 'category_Name' nor 'folder_Name' query parameter found in the URL
    }
}

getCategory = () => {
    let category_Display = $('#category_Display')
    category_Display.html(null)

    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)

    $.ajax({
        type: 'GET',
        url: '/api/guest/getKBCategory',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <a class="list-group-item list-group-item-action" onclick="chosenCategory('${data.category_Name}')">${data.category_Name}</a>
                        `;
                    category_Display.append(format)
                });
            }
            else {
                notyf.success({
                    message: 'No Category Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Category Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

chosenCategory = (category_Name) => {
    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)
    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBCategoryInfo/${category_Name}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            let format = `
            <div class="card card-link card-link-pop">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-category-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M14 4h6v6h-6z" />
                            <path d="M4 14h6v6h-6z" />
                            <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            <path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            </svg>
                        </div> 
                        <div class="col-8">
                            <h3 class="text-primary">Category: ${data.category_Name}</h3>
                        </div>   
                    </div> 
                </div>
            </div>
            <div class="row align-items-center">
                <h2 class="text-dark mt-2">Folders</h2>
            </div>
            `;
            chosen_Display.append(format)

            getFolder(data.category_Id)
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Category Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getFolder = (category_Id) => {
    let main_Display = $('#main_Display')
    main_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBFolder/${category_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <div class="mb-2">
                        <div class="card card-link card-link-pop mb-2">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-1" onclick="chosenFolder('${data.folder_Id}')">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-folder" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                                        </svg>
                                    </div>
                                    <div class="col-8" onclick="chosenFolder('${data.folder_Id}')">
                                        <h3 class="text-primary">${data.folder_Name}</h3>
                                    </div>   
                                </div> 
                            </div>
                        </div>
                    </div>
                        `;
                    main_Display.append(format)
                });
            }
            else {
                main_Display.append('<h2 class="text-dark text-center mt-3 mb-3">Folders is Empty</h2>')
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Folder Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getFolderbyName = (folder_Name) => {
    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBFolderbyName/${folder_Name}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

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
                        <div class="col-auto">
                            <h3 class="text-primary">Folder: ${data.folder_Name}</h3>
                        </div>   
                    </div> 
                </div>
            </div>
            <h2 class="text-dark mt-2">Topics</h2>
            `;
            chosen_Display.append(format)
            getTopic(data.folder_Id)
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Folder Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

chosenFolder = (folder_Id) => {
    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)
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
                        <div class="col-auto">
                            <h3 class="text-primary">Folder: ${data.folder_Name}</h3>
                        </div>   
                    </div> 
                </div>
            </div>
            <h2 class="text-dark mt-2">Topics</h2>
            `;
            chosen_Display.append(format)

            getTopic(data.folder_Id)
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Folder Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getTopic = (folder_Id) => {
    let main_Display = $('#main_Display')
    main_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBTopic/${folder_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <div class="mb-2">
                        <div class="card card-link card-link-pop" onclick="getTopicInfoAndNavigate('${data.topic_Number}')">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-auto">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-book"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" /></svg>
                                    </div>
                                    <div class="col-md-auto">
                                        <h2 class="text-primary">${data.topic_Name}</h2>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <p>Last Modified: <strong>${formatPostgresTimestamp(data.last_modified)}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    main_Display.append(format)
                });
            }
            else {
                main_Display.append('<h2 class="text-dark text-center mt-3 mb-3">Topics is Empty</h2>')
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Topic Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

function getTopicInfoAndNavigate(topic_Number) {

    // Create the URL with the guide_Id parameter
    const detailsURL = `/knowledgebase/view?topic_Number=${topic_Number}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}