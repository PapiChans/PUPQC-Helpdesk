$(function() {
    $('#AddTopicForm').on('submit', function (e) {
        addTopic()
        e.preventDefault() // prevent page refresh
    })
    getCategory();
    // Add onchange event listener to the select element
    $('#get_category').on('change', function() {
        // Remove the "Select Category" option
        $(this).find('option[value=""]').remove();
        // Call getFolder function passing the selected category_Id
        let selectedCategoryId = $(this).val();
        getFolder(selectedCategoryId);
    }); 
    getuserName();
});

const notyf = new Notyf();

getCategory = () => {

    let category_Display = $('#get_category')

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
                    let option =
                    `<option value="${data.category_Id}">${data.category_Name}</option>`

                    category_Display.append(option)

                });
            }
            else {
                notyf.success({
                    message: 'No Category Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });

                let option =
                    `<option value="">No Available Category</option>`
                    category_Display.append(option)
                    $('#get_category').prop('disabled', true);
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

getFolder = (category_Id) => {

    let folder_Display = $('#get_folder')
    folder_Display.html(null)
    $('#get_folder').prop('disabled', true);

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
                    let option =
                    `<option value="${data.folder_Id}">${data.folder_Name}</option>`

                    folder_Display.append(option)
                    $('#get_folder').prop('disabled', false);

                });
            }
            else {
                notyf.success({
                    message: 'No Folder Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                let option =
                    `<option value="">No Available Folder</option>`

                    folder_Display.append(option)
                $('#get_folder').prop('disabled', true);
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

addTopic = () => {
    if ($('#AddTopicForm')[0].checkValidity()) {
        const form = new FormData($('#AddTopicForm')[0]);

        $('#topic_Submit').prop('disabled', true);
        
        const topic_Name = $('#topic_Name').val();
        const topic_Content = $('#topic_Content').val();
        const get_Full_Name = $('#get_Full_Name').val();
        const folder_Id = $('#get_folder').val();
        const status = $('#status').val();

        const data = {
            topic_Name: topic_Name,
            topic_Content: topic_Content,
            created_by: get_Full_Name,
            folder_Id: folder_Id,
            status: status,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addKBTopic',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#topic_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Topic Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddTopicForm')[0].reset();
                        $('#topic_Submit').prop('disabled', false);
                        setTimeout(function () {
                            window.location.href = `/admin/knowledgebase`;
                        }, 1000);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Topic. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#topic_Submit').prop('disabled', false);
        })
    }
}

getuserName = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#get_Full_Name').val(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Fetch Profile Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}