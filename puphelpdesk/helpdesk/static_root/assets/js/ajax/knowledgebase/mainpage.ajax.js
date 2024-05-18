$(function() {
    getCategory();
});

const notyf = new Notyf();

getCategory = () => {
    let category_Display = $('#category_Display')
    category_Display.html(null)

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
                    <div class="col-6">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-category-2" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M14 4h6v6h-6z" />
                                    <path d="M4 14h6v6h-6z" />
                                    <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                    <path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                </svg>
                            </div>
                            <div class="col-auto pt-1">
                                <h2 class="text-primary"><a href="#" onclick="getCategoryInfoAndNavigate('${data.category_Name}')">${data.category_Name}</a></h2>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto">
                            </div>
                            <div class="col-auto">
                                <ul id="folder-${data.category_Id}">
                                
                                </ul>
                            </div>
                        </div>
                    </div>
                    `;
                    category_Display.append(format)
                    getFolder(data.category_Id, data.category_Name)
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

getFolder = (category_Id, category_Name) => {
    let folder_Display = $(`#folder-${category_Id}`)
    folder_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBFolder/${category_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) { // If there are folders
                let folderCount = data.length; // Count all folders
                let displayCount = Math.min(folderCount, 5); // Display up to 5 folders

                data.slice(0, displayCount).forEach((data) => { // Loop through the first 5 folders
                    let format = `<li class="text-primary"><h3><a href="#" onclick="getFolderInfoAndNavigate('${data.folder_Name}')"  class="text-primary">${data.folder_Name}</a></h3></li>`;
                    folder_Display.append(format);
                });

                if (folderCount > 5) { // If total folders exceed 5, display "View More" with total count
                    folder_Display.append(`<h3><a href="#" onclick="getCategoryInfoAndNavigate('${category_Name}')" class="text-primary">View More (${folderCount})</a></h3>`);
                }
            } else { // If there are no folders
                folder_Display.append(`<li class="text-primary"><h3 class="text-primary">Adding soon</h3></li>`);
            }
        },
        error: () => { // Handle AJAX error
            folder_Display.append(`<li class="text-primary"><h3>Fetching error</h3></li>`);
        }
    });
}

function getCategoryInfoAndNavigate(category_Name) {

    // Create the URL with the guide_Id parameter
    const detailsURL = `/knowledgebase/browse?category_Name=${category_Name}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

function getFolderInfoAndNavigate(folder_Name) {

    // Create the URL with the guide_Id parameter
    const detailsURL = `/knowledgebase/browse?folder_Name=${folder_Name}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}