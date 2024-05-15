$(function() {
    $('#AddCategoryForm').on('submit', function (e) {
        addCategory()
        e.preventDefault() // prevent page refresh
    })
    getCategory();
    $('#EditCategoryForm').on('submit', function (e) {
        editCategory(category_Id = $('#edit_category_Id'))
        e.preventDefault() // prevent page refresh
    })
    $('#AddFolderForm').on('submit', function (e) {
        addFolder()
        e.preventDefault() // prevent page refresh
    })
    $('#EditFolderForm').on('submit', function (e) {
        editFolder(folder_Id = $('#get_folder_Id'))
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

// ----------------
// Knowledgebase Category
// ----------------

addCategory = () => {
    if ($('#AddCategoryForm')[0].checkValidity()) {
        const form = new FormData($('#AddCategoryForm')[0]);

        $('#category_Submit').prop('disabled', true);
        
        const category_Name = $('#category_Name').val();

        const data = {
            category_Name: category_Name,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addKBCategory',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#category_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Category Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddCategoryForm')[0].reset();
                        $('#AddCategoryModal').modal('hide');
                        let category_Display = $('#category_Display');
                        category_Display.html(null);
                        getCategory();
                        $('#category_Submit').prop('disabled', false);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Category. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#category_Submit').prop('disabled', false);
        })
    }
}

getCategory = () => {
    let category_Display = $('#category_Display')
    category_Display.html(null)

    let get_category_Id = $('#get_category_Id')
    get_category_Id.html(null)

    let edit_get_category_Id = $('#edit_get_category_Id')
    edit_get_category_Id.html(null)

    let main_Display = $('#main_Display')
    main_Display.html(null)

    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)

    $.ajax({
        type: 'GET',
        url: '/api/admin/getKBCategory',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <a class="list-group-item list-group-item-action" onclick="chosenCategory('${data.category_Id}')">${data.category_Name}</a>
                        `;
                    category_Display.append(format)

                    let option =
                    `<option value="${data.category_Id}">${data.category_Name}</option>`

                    get_category_Id.append(option)
                    edit_get_category_Id.append(option)
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

chosenCategory = (category_Id) => {
    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)
    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBCategoryInfo/${category_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            // Pass the data in the form
            $('#edit_category_Id').val(data.category_Id)
            $('#edit_category_Name').val(data.category_Name)

            let format = `
            <div class="card card-link">
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
                        <div class="col-auto">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#EditCategoryModal">Edit</button>
                            <button class="btn btn-danger" onclick="deleteCategory('${data.category_Id}')">Delete</button>
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

editCategory = (category_Id) => {
    if ($('#EditCategoryForm')[0].checkValidity()) {
        const form = new FormData($('#EditCategoryForm')[0]);

        $('#edit_category_Submit').prop('disabled', true);
        
        const category_Id = $('#edit_category_Id').val();
        const category_Name = $('#edit_category_Name').val();

        const data = {
            category_Name: category_Name,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editKBCategory/${category_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_category_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Category Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditCategoryForm')[0].reset();
                        $('#EditCategoryModal').modal('hide');
                        getCategory();
                        chosenCategory(category_Id);
                        $('#edit_category_Submit').prop('disabled', false);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Category. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_category_Submit').prop('disabled', false);
        })
    }
}

deleteCategory = (category_Id) => {

    Swal.fire({
        title: 'Delete Category',
        html: 'Are you sure do you want to delete this Category?',
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
                url: `/api/admin/deleteKBCategory/${category_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        if (result.code == '200') {
                        notyf.success({
                            message: 'Delete Category Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            getCategory();
                        }
                        else if (result.code == '409'){
                            Swal.fire({
                                title: 'Conflict!',
                                text: `${result.message}`,
                                icon: 'error',
                                allowEnterKey: 'false',
                                allowOutsideClick: 'false',
                                allowEscapeKey: 'false',
                                confirmButtonText: 'Okay',
                                confirmButtonColor: '#D40429',
                            })
                        }
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting Category. Please try again.',
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

// ----------------
// Knowledgebase Folder
// ----------------

addFolder = () => {
    if ($('#AddFolderForm')[0].checkValidity()) {
        const form = new FormData($('#AddFolderForm')[0]);

        $('#folder_Submit').prop('disabled', true);
        
        const folder_Name = $('#folder_Name').val();
        const category_Id = $('#get_category_Id').val();

        const data = {
            folder_Name: folder_Name,
            category_Id: category_Id,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addKBFolder',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#folder_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Folder Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddFolderForm')[0].reset();
                        $('#AddFolderModal').modal('hide');
                        $('#folder_Submit').prop('disabled', false);
                        chosenCategory(category_Id)
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Folder. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#folder_Submit').prop('disabled', false);
        })
    }
}

getFolder = (category_Id) => {
    let main_Display = $('#main_Display')
    main_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBFolder/${category_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <div class="mb-2">
                        <div class="card card-link mb-2">
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
                                    <div class="col-3">
                                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#EditFolderModal" onclick="getFolderInfo('${data.folder_Id}')">Edit</button>
                                        <button class="btn btn-danger" onclick="deleteFolder('${data.folder_Id}', '${data.category_Id}')">Delete</button>
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

getFolderInfo = (folder_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBFolderInfo/${folder_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            // Pass the data in the form
            $('#get_folder_Id').val(data.folder_Id)
            $('#edit_folder_Name').val(data.folder_Name)
            $('#edit_get_category_Id').val(data.category_Id)

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

editFolder = (folder_Id) => {
    if ($('#EditFolderForm')[0].checkValidity()) {
        const form = new FormData($('#EditFolderForm')[0]);

        $('#edit_folder_Submit').prop('disabled', true);
        
        const category_Id = $('#edit_get_category_Id').val();
        const folder_Name = $('#edit_folder_Name').val();
        const folder_Id = $('#get_folder_Id').val();

        const data = {
            folder_Name: folder_Name,
            category_Id: category_Id,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editKBFolder/${folder_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_folder_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Folder Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditFolderForm')[0].reset();
                        $('#EditFolderModal').modal('hide');
                        $('#edit_folder_Submit').prop('disabled', false);
                        chosenCategory(category_Id);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Folder. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_folder_Submit').prop('disabled', false);
        })
    }
}

deleteFolder = (folder_Id, category_Id) => {

    Swal.fire({
        title: 'Delete Folder',
        html: 'Are you sure do you want to delete this Folder?',
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
                url: `/api/admin/deleteKBFolder/${folder_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        if (result.code == '200') {
                        notyf.success({
                            message: 'Delete Folder Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            let chosen_Display = $('#chosen_Display');
                            chosen_Display.html(null);
                            getFolder(category_Id);
                        }
                        else if (result.code == '409'){
                            Swal.fire({
                                title: 'Conflict!',
                                text: `${result.message}`,
                                icon: 'error',
                                allowEnterKey: 'false',
                                allowOutsideClick: 'false',
                                allowEscapeKey: 'false',
                                confirmButtonText: 'Okay',
                                confirmButtonColor: '#D40429',
                            })
                        }
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting Folder. Please try again.',
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

chosenFolder = (folder_Id) => {
    let chosen_Display = $('#chosen_Display')
    chosen_Display.html(null)
    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBFolderInfo/${folder_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            // Pass the data in the form

            let format = `
            <div class="card card-link">
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

// ----------------
// Knowledgebase Topic
// ----------------

getTopic = (folder_Id) => {
    let main_Display = $('#main_Display')
    main_Display.html(null)

    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBTopic/${folder_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let format = `
                    <div class="mb-2">
                        <div class="card card-link">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-auto">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-book"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" /></svg>
                                    </div>
                                    <div class="col-md-auto">
                                        <h2 class="text-primary">${data.topic_Name}</h2>
                                    </div>
                                </div> 
                                <div class="row align-items-center">
                                    <div class="col">
                                        <p>The Description....</p>
                                    </div> 
                                    <div class="col-auto">
                                        <button class="btn btn-primary">Edit</button>
                                        <button class="btn btn-danger">Delete</button>
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