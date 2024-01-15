$(function() {
    $('#AddItemForm').on('submit', function (e) {
        addLostItem(ItemImage)
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

ItemImage = FilePond.create(document.querySelector('#item_Image'), {
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

addLostItem = (ItemImage) => {
    if ($('#AddItemForm')[0]) {
        const form = new FormData($('#AddItemForm')[0])
        
        const user_Id = $('#user_Id').val();
        const item_Owner = $('#item_Owner').val();
        const item_Name = $('#item_Name').val();
        const item_Description = $('#item_Description').val();
        const item_Last_Seen = $('#item_Last_Seen').val();
        const item_Lost_Date = $('#item_Lost_Date').val();
        const item_Lost_Time = $('#item_Lost_Time').val();

        const formVariables = [
            user_Id,
            item_Owner,
            item_Name,
            item_Description,
            item_Last_Seen,
            item_Lost_Date,
            item_Lost_Time,
        ];

        if (
			form.get('filepond') == '' ||
			Object.prototype.toString.call(form.get('filepond')) === '[object File]'
		) {
			form.delete('filepond')
		}

        pondFiles = ItemImage.getFiles()
		for (var i = 0; i < pondFiles.length; i++) {
			// append the blob file
			if (pondFiles[i].file != null) {
				form.append('item_Image', pondFiles[i].file)
                
			}
		}

		for (var pair of form.entries()) {
			console.log(pair[0] + ': ' + pair[1])
		}

        if (pondFiles.length === 0 || hasNullOrEmptyValue(formVariables)) {
            Swal.fire({
                title: 'Some of Input fields is Empty',
                text: 'Please upload Item Image and Enter required fields.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
        }
        else {
            form.append('user_Id', user_Id);
            form.append('item_Owner', item_Owner);
            form.append('item_Name', item_Name);
            form.append('item_Description', item_Description);
            form.append('item_Last_Seen', item_Last_Seen);
            form.append('item_Lost_Date', item_Lost_Date);
            form.append('item_Lost_Time', item_Lost_Time);

            notyf.open({
                message: 'Posting Lost Item. Please Wait...',
                position: {x:'right',y:'top'},
                background: 'gray',
                duration: 3000
            });
            
            $.ajax({
                type: 'POST',
                url: '/api/student/addLostItem',
                dataType: 'json',
                data: form,
                processData: false,
                contentType: false,
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        $('#item_Submit').prop('disabled', true);
                        notyf.success({
                            message: 'Post Lost Item Successfully',
                            position: {x:'right',y:'top'},
                            duration: 2500
                        })
                        $('form#AddItemForm')[0].reset();

                        setTimeout(function () {
                            window.location.href = `/student/LostAndFound/items`
                        }, 2600);

                    }
                },
            })
            .fail(() => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong while posting Lost Item. Please try again.',
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