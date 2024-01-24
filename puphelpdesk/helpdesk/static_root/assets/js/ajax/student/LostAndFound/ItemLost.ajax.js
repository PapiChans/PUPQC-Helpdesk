$(function() {
    getLostItem();
    $('#EditItemForm').on('submit', function (e) {
        editLostItem()
        e.preventDefault() // prevent page refresh
    })
    $('#ReplaceItemImageForm').on('submit', function (e) {
        const item_Id = $('#replace_item_Id').val()
        replaceItemImage(ReplaceItemImage, item_Id)
        e.preventDefault() // prevent page refresh
    })
})

const notyf = new Notyf();

$('input[type="date"]').flatpickr({
    mode: 'single',
    minDate: "today",
    allowInput: true,
    dateFormat: "Y-m-d"
});
$('input[type="time"]').flatpickr({
    enableTime: true,
    allowInput: true,
    noCalendar: true,
    minTime: "06:00",
    maxTime: "00:00",
});

const ImageFileTypes = ['image/png', 'image/jpeg']

ReplaceItemImage = FilePond.create(document.querySelector('#replace_item_Image'), {
    instantUpload: false,
    allowProcess: false,
    acceptedFileTypes: ImageFileTypes,
    beforeAddFile: (file) => {
        // Check if the file type is not accepted
        if (!ImageFileTypes.includes(file.fileType)) {
            // Show an error message
            // * Sweetalert2 that will say: JPG, and PNG files are allowed
            Swal.fire({
                title: 'Something went wrong',
                text: `The file format you uploaded is ${file.fileType}`,
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            // Reject the file
            return false
        }
        // Continue with the file upload
        return true
    },
})

// Function to check Null Fields
function hasNullOrEmptyValue(variables) {
    return variables.some(value => value === null || value.trim() === '');
}

// 24-Hour to 12-Hour Converter
function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert to 12-hour format

    const time12 = `${hours12}:${minutes} ${period}`;
    return time12;
}

// Date Formatter
function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

getLostItem = () => {
    let missing_display = $('#missing_display')
    let claim_display = $('#claim_display')
    let found_display = $('#found_display')

    notyf.open({
        message: 'Fetching Lost Items',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/student/getLostItem',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const itemdata = result;
            if (itemdata.length > 0) {
                itemdata.forEach((itemdata) => {

                    let status = null;
                    if (itemdata.item_Status == 'Missing') {
                        status = '<span class="badge bg-red text-red-fg">Missing</span>'
                    }
                    if (itemdata.item_Status == 'Claim Verification') {
                        status = '<span class="badge bg-info text-red-fg">Claim Verification</span>'
                    }
                    if (itemdata.item_Status == 'Found') {
                        status = '<span class="badge bg-success text-red-fg">Found</span>'
                    }

                    const formattedDate = formatDate(itemdata.item_Lost_Date)
                    const formattedTime = convertTo12HourFormat(itemdata.item_Lost_Time)


                    let itemformat = `
                    <div class="col-md-4">
                    <div class="card">
                        <div class="img-responsive img-responsive-22x9 card-img-top" style="background-image: url(${itemdata.item_Image})"></div>
                        <div class="card-body">
                            <h4>${itemdata.item_Name} ${status}</h4>
                            <p class="text-secondary">Last Seen: ${itemdata.item_Last_Seen}</p>
                            <p class="text-secondary">Date of Lost: ${formattedDate} - ${formattedTime}</p>
                        </div>
                        <div class="card-footer">
                            <h4 class="text-secondary">Owner: ${itemdata.item_Owner}</h4>
                        </div>
                    </div>
                        <div class="mt-2 text-center">
                            <button type="button" class="btn btn-info waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#LostItemInfoModal" onclick="getLostItemInfo('${itemdata.item_Id}')">Information</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#LostItemEditModal" onclick="foredititem('${itemdata.item_Id}')">Edit</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light mb-2" data-bs-toggle="modal" data-bs-target="#ReplaceItemImageModal" onclick="forreplaceimage('${itemdata.item_Id}')">Replace</button>
                            <button type="button" class="btn btn-danger waves-effect waves-light mb-2" onclick="deleteLostItem('${itemdata.item_Id}')">Delete</button>
                        </div>
                    </div>
                        `;

                    if (itemdata.item_Status == 'Missing') {
                        $('#no-missing').html(null)
                        missing_display.append(itemformat)
                    }
                    if (itemdata.item_Status == 'Claim Verification') {
                        $('#no-claim').html(null)
                        claim_display.append(itemformat)
                    }
                    if (itemdata.item_Status == 'Found') {
                        $('#no-found').html(null)
                        found_display.append(itemformat)
                    }


                });
                notyf.success({
                    message: 'Item Lost Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Item Lost Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Item Lost Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

getLostItemInfo = (item_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getLostItemInfo/${item_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const itemdata = result;
            const formattedDate = formatDate(itemdata.item_Lost_Date)
            const formattedTime = convertTo12HourFormat(itemdata.item_Lost_Time)
            let status = null;
            if (itemdata.item_Status == 'Missing') {
                status = '<span class="badge bg-red text-red-fg">Missing</span>'
            }
            if (itemdata.item_Status == 'Claim Verification') {
                status = '<span class="badge bg-info text-red-fg">Claim Verification</span>'
            }
            if (itemdata.item_Status == 'Found') {
                status = '<span class="badge bg-success text-red-fg">Found</span>'
            }
            $('#item_Image_info').attr('src', `${itemdata.item_Image}`);
            $('#item_Status_info').html(status);
            $('#item_Name_info').html(itemdata.item_Name);
            $('#item_Owner_info').html(itemdata.item_Owner);
            $('#item_Description_info').html(itemdata.item_Description);
            $('#item_Last_Seen_info').html(itemdata.item_Last_Seen);
            $('#item_Lost_Date_info').html(formattedDate);
            $('#item_Lost_Time_info').html(formattedTime);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Item Lost Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foredititem = (item_Id) => getItemforEdit(item_Id)

getItemforEdit= (item_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getLostItemInfo/${item_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const itemdata = result;
            $('#edit_item_Id').val(itemdata.item_Id);
            $('#edit_item_Name').val(itemdata.item_Name);
            $('#edit_item_Description').val(itemdata.item_Description);
            $('#edit_item_Last_Seen').val(itemdata.item_Last_Seen);
            $('#edit_item_Lost_Date').val(itemdata.item_Lost_Date);
            $('#edit_item_Lost_Time').val(itemdata.item_Lost_Time);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Item Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editLostItem = (item_Id) => {
    if ($('#EditItemForm')[0]) {
        const form = new FormData($('#EditItemForm')[0])
        
        const item_Id = $('#edit_item_Id').val();
        const item_Name = $('#edit_item_Name').val();
        const item_Description = $('#edit_item_Description').val();
        const item_Last_Seen = $('#edit_item_Last_Seen').val();
        const item_Lost_Date = $('#edit_item_Lost_Date').val();
        const item_Lost_Time = $('#edit_item_Lost_Time').val();

        form.append('item_Name', item_Name);
        form.append('item_Description', item_Description);
        form.append('item_Last_Seen', item_Last_Seen);
        form.append('item_Lost_Date', item_Lost_Date);
        form.append('item_Lost_Time', item_Lost_Time);

        notyf.open({
            message: 'Saving Lost Item. Please Wait...',
            position: {x:'right',y:'top'},
            background: 'gray',
            duration: 3000
        });
        
        $.ajax({
            type: 'PUT',
            url: `/api/student/editLostItem/${item_Id}`,
            dataType: 'json',
            data: form,
            processData: false,
            contentType: false,
            cache: false,
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_item_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Item Lost Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                    $('form#EditItemForm')[0].reset();
                    $('#LostItemEditModal').modal('hide');

                    setTimeout(function () {
                        location.reload()
                    }, 2600);

                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Item Lost. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        })
    }
}

forreplaceimage = (item_Id) => getLostItemforReplaceLogo(item_Id)

getLostItemforReplaceLogo = (item_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getLostItemInfo/${item_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const itemdata = result;
            $('#replace_item_Id').val(itemdata.item_Id);
            $('#replace_item_Name').html(itemdata.item_Name);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Lost Item Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

replaceItemImage = (ReplaceItemImage, item_Id) => {
    if ($('#ReplaceItemImageForm')[0]) {
        const form = new FormData($('#ReplaceItemImageForm')[0])

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = ReplaceItemImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('replace_item_Image', pondFiles[i].file)
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0) {
            Swal.fire({
                title: 'Upload Image is empty.',
                text: 'Please upload the Image Replacement.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
            notyf.open({
                message: 'Uploading Image. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'PUT',
                url: `/api/student/replaceLostItemImage/${item_Id}`,
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    notyf.success({
                        message: 'Replace Item Image Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#ReplaceItemImageForm')[0].reset();
                        $('#ReplaceItemImageModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while replacing item image. Please try again.',
                    icon: 'error',
                    allowEnterKey: 'false',
                    allowOutsideClick: 'false',
                    allowEscapeKey: 'false',
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#D40429',
                })
            })
        }
    }
}

deleteLostItem = (item_Id) => {

    Swal.fire({
        title: 'Delete Lost Item Post',
        html: `Are you sure do you want to delete this Lost Item Post?`,
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
                url: `/api/student/deleteLostItem/${item_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Lost Item Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        });
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while deleting Lost Item Post. Please try again.',
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