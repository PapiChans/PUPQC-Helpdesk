$(function () {
    $('#AddCharterForm').on('submit', function (e) {
        e.preventDefault() // prevent page refresh
        addCharter()
    })
    getCharter();
    $('#EditCharterForm').on('submit', function (e) {
        editCharter()
        e.preventDefault() // prevent page refresh
    })
})

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

const notyf = new Notyf();

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

function generateRandomNumber() {
    // Define the prefix for the ticket number
    const prefix = "Charter-";

    // Define the length of the random part
    const randomLength = 20;

    // Generate a random string of alphanumeric characters
    const randomPart = Array.from({ length: randomLength }, () =>
        Math.random().toString(36).charAt(2)
    ).join('');

    // Combine the prefix and the random part to create the ticket number
    const Number = prefix + randomPart;

    return Number;
}

function getCharterInfoAndNavigate(charterId) {
    // Create the URL with the guide_Id parameter
    const detailsURL = `/admin/charters/details?charter_number=${charterId}`;
    
    // Navigate to the specified URL
    window.location.href = detailsURL;
}

const charter_Number = generateRandomNumber();
$('#charter_Number').val(generateRandomNumber());

addCharter = () => {
    if ($('#AddCharterForm')[0].checkValidity()) {
        const form = new FormData($('#AddCharterForm')[0]);

        $('#charter_Submit').prop('disabled', true);
        
        const charter_Number = $('#charter_Number').val();
        const charter_Category = $('#charter_Category').val();
        const charter_Title = $('#charter_Title').val();
        const charter_Description = $('#charter_Description').val();
        const charter_Office = $('#charter_Office').val();
        const charter_Classification = $('#charter_Classification').val();
        const charter_Transaction = $('#charter_Transaction').val();
        const charter_Avail = $('#charter_Avail').val();
        const charter_Requirements = $('#charter_Requirements').val();
        const charter_Secure = $('#charter_Secure').val();

        const data = {
            charter_Number: charter_Number,
            charter_Category: charter_Category,
            charter_Title: charter_Title,
            charter_Description: charter_Description,
            charter_Office: charter_Office,
            charter_Classification: charter_Classification,
            charter_Transaction: charter_Transaction,
            charter_Avail: charter_Avail,
            charter_Requirements: charter_Requirements,
            charter_Secure: charter_Secure,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addCharter',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#charter_Submit').prop('disabled', false);
                    notyf.success({
                        message: 'Add Charter Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddCharterForm')[0].reset();
                        $('#AddCharterModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Charter. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#charter_Submit').prop('disabled', false);
        })
    }
}

getCharter = () => {
    let charter_display = $('#charter_display')
    charter_display.html(null)
    $('#no_Charter').html("Loading...");

    $.ajax({
        type: 'GET',
        url: '/api/admin/getCharter',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${data.charter_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${truncateText(data.charter_Description.replace(/\n/g, '</p><p>'),200)}</p>
                                <div class="text-center">
                                <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getCharterInfoAndNavigate('${data.charter_Number}')">View</button></a>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditCharterModal" onclick="foreditcharter('${data.charter_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteCharter('${data.charter_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    charter_display.append(charterformat)
                    $('#no_Charter').html(null);

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Charter').html("No Charter Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditcharter = (charter_Id) => getCharterforEdit(charter_Id)

getCharterforEdit = (charter_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharterInfo/${charter_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#edit_charter_Id').val(data.charter_Id);
            $('#edit_charter_Title').val(data.charter_Title);
            $('#edit_charter_Description').val(data.charter_Description);
            $('#edit_charter_Category').val(data.charter_Category);
            $('#edit_charter_Office').val(data.charter_Office);
            $('#edit_charter_Classification').val(data.charter_Classification);
            $('#edit_charter_Transaction').val(data.charter_Transaction);
            $('#edit_charter_Avail').val(data.charter_Avail);
            $('#edit_charter_Requirements').val(data.charter_Requirements);
            $('#edit_charter_Secure').val(data.charter_Secure);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editCharter = (charter_Id) => {
    if ($('#EditCharterForm')[0].checkValidity()) {
        const form = new FormData($('#EditCharterForm')[0]);

        $('#edit_charter_Submit').prop('disabled', true);

        const charter_Id = $('#edit_charter_Id').val();
        const charter_Category = $('#edit_charter_Category').val();
        const charter_Title = $('#edit_charter_Title').val();
        const charter_Description = $('#edit_charter_Description').val();
        const charter_Office = $('#edit_charter_Office').val();
        const charter_Classification = $('#edit_charter_Classification').val();
        const charter_Transaction = $('#edit_charter_Transaction').val();
        const charter_Avail = $('#edit_charter_Avail').val();
        const charter_Requirements = $('#edit_charter_Requirements').val();
        const charter_Secure = $('#edit_charter_Secure').val();

        const data = {
            charter_Category: charter_Category,
            charter_Title: charter_Title,
            charter_Description: charter_Description,
            charter_Office: charter_Office,
            charter_Classification: charter_Classification,
            charter_Transaction: charter_Transaction,
            charter_Avail: charter_Avail,
            charter_Requirements: charter_Requirements,
            charter_Secure: charter_Secure,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editCharter/${charter_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_charter_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Charter Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditCharterForm')[0].reset();
                        $('#EditCharterModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while editing charter. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_charter_Submit').prop('disabled', false);
        })
    }
}

deleteCharter = (charter_Id) => {

    Swal.fire({
        title: 'Delete Charter',
        html: 'Are you sure do you want to delete this Charter?',
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
                url: `/api/admin/deleteCharter/${charter_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result.message == 'Step Exist') {
                        Swal.fire({
                            title: 'Oops!',
                            text: 'There are steps exists in this charter, clear them all first.',
                            icon: 'error',
                            allowEnterKey: 'false',
                            allowOutsideClick: 'false',
                            allowEscapeKey: 'false',
                            confirmButtonText: 'Okay',
                            confirmButtonColor: '#D40429',
                        })
                    }
                    else {
                        notyf.success({
                            message: 'Delete Charter Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                            location.reload()
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting charter. Please try again.',
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

getCharterCategory = (selected_charter_Category) => {
    $('#no_Charter').html("Loading...");
    let charter_display = $('#charter_display')
    charter_display.html(null)
    let charter_Category = selected_charter_Category

    $.ajax({
        type: 'GET',
        url: `/api/admin/getCharter/${charter_Category}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${data.charter_Title}</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${truncateText(data.charter_Description.replace(/\n/g, '</p><p>'),200)}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getCharterInfoAndNavigate('${data.charter_Number}')">View</button></a>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditCharterModal" onclick="foreditcharter('${data.charter_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteCharter('${data.charter_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                    charter_display.append(charterformat)
                    $('#no_Charter').html(null);

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Charter').html("No Charter Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

searchCharter = () => {
    $('#no_Charter').html("Searching...");
    let charter_display = $('#charter_display')

    $('#charter_Search').prop('disabled', true);
    const charter_Keyword = $('#charter_Keyword').val();

    const data = {
        charter_Keyword: charter_Keyword
    }

    if (!charter_Keyword || charter_Keyword.trim() === '') {
        $('#no_Charter').html("Keywords is Empty.");
        $('#charter_Search').prop('disabled', false);
    }
    else {

        charter_display.html(null)

        $.ajax({
            type: 'POST',
            url: `/api/admin/searchCharter/${charter_Keyword}`,
            data: data,
            dataType: 'json',
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                notyf.dismissAll();
                const data = result;
                if (data.length > 0) {
                    data.forEach((data) => {

                        let charterformat = `
                        <div class="col-xl-4">
                            <div class="card mb-2">
                                <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${data.charter_Title}</h3>
                                <div class="card-body">
                                    <p class="card-text font-size-15">${truncateText(data.charter_Description.replace(/\n/g, '</p><p>'),200)}</p>
                                    <div class="text-center">
                                        <button type="button" class="btn btn-primary waves-effect waves-light" onclick="getCharterInfoAndNavigate('${data.charter_Number}')">View</button></a>
                                        <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditCharterModal" onclick="foreditcharter('${data.charter_Id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                                        <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteCharter('${data.charter_Id}')"><i class="fa-solid fa-trash"></i> Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                            `;

                        charter_display.append(charterformat)
                        $('#no_Charter').html('Search Results for: '+ charter_Keyword);
                        $('#charter_Search').prop('disabled', false);

                    });
                }
                else {
                    notyf.success({
                        message: 'No Charter Fetched.',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    });
                    $('#no_Charter').html("Search No Results");
                    $('#charter_Search').prop('disabled', false);
                }
            },
        })
        .fail(() => {
            notyf.error({
                message: 'Charter Fetched Error',
                position: {x:'right',y:'top'},
                duration: 2500
            });
            $('#charter_Search').prop('disabled', false);
        })
    }
}