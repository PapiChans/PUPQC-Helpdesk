$(function() {
    $('#EditTopicForm').on('submit', function (e) {
        editTopic()
        e.preventDefault() // prevent page refresh
    })
    getCategory();
    // Add onchange event listener to the select element
    $('#edit_get_category').on('change', function() {
        // Remove the "Select Category" option
        $(this).find('option[value=""]').remove();
        // Call getFolder function passing the selected category_Id
        let selectedCategoryId = $(this).val();
        getFolder(selectedCategoryId);
    });
    $(document).ready(function () {
        const topicNum = getTopicIdFromURL();
        if (topicNum) {
            getTopicInfo(topicNum);
        } else {
            window.location.href = '/Not_Found'
        }
    });
});

const notyf = new Notyf();

function getTopicIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('topic_Number');
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

getCategory = () => {

    let category_Display = $('#edit_get_category')

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
                    $('#edit_get_category').prop('disabled', true);
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

    let folder_Display = $('#edit_get_folder')
    folder_Display.html(null)
    $('#edit_get_folder').prop('disabled', true);

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
                    $('#edit_get_folder').prop('disabled', false);

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
                $('#edit_get_folder').prop('disabled', true);
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

getTopicInfo = (topic_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getKBTopicInfo/${topic_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            // Pass the data in the form
            $('#edit_topic_Name').val(data.topic_Name)
            $('#edit_topic_Content').val(data.topic_Content)
            $('#get_Full_Name').val(data.created_by)
            $('#edit_status').val(data.status)
            $('#get_Date_Created').html(formatPostgresTimestamp(data.date_Created))
            $('#get_Last_Modified').html(formatPostgresTimestamp(data.last_modified))
            $('#LikesCount').html(data.likes)
            $('#DislikesCount').html(data.dislikes)

        },
    })
    .fail(() => {
        notyf.error({
            message: 'Topic Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
        window.location.href = '/Not_Found'
    })
}

deleteTopic = (topic_Number) => {

    var topic_Number = getTopicIdFromURL();

    Swal.fire({
        title: 'Delete Topic',
        html: 'Are you sure do you want to delete this Topic?',
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
                url: `/api/admin/deleteKBTopic/${topic_Number}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        if (result.code == '200') {
                        notyf.success({
                            message: 'Delete Topic Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            setTimeout(function () {
                                window.location.href = `/admin/knowledgebase`;
                            }, 1000);
                        }
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting Topic. Please try again.',
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

editTopic = (topic_Number) => {

    var topic_Number = getTopicIdFromURL();

    if ($('#EditTopicForm')[0].checkValidity()) {
        const form = new FormData($('#EditTopicForm')[0]);

        $('#edit_topic_Submit').prop('disabled', true);
        
        const topic_Name = $('#edit_topic_Name').val();
        const topic_Content = $('#edit_topic_Content').val();
        const status = $('#edit_status').val();
        const folder_Id = $('#edit_get_folder').val();

        const data = {
            topic_Name: topic_Name,
            topic_Content: topic_Content,
            status: status,
            folder_Id: folder_Id,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editKBTopic/${topic_Number}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_topic_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Topic Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        setTimeout(function () {
                            window.location.href = `/admin/knowledgebase`;
                        }, 1000);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Topic. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_topic_Submit').prop('disabled', false);
        })
    }
}