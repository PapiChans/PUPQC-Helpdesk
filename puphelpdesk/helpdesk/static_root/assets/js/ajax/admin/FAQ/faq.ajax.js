$(function() {
    $('#AddFAQForm').on('submit', function (e) {
        addFAQ()
        e.preventDefault() // prevent page refresh
    })
    getFAQ();
    $('#EditFAQForm').on('submit', function (e) {
        editFAQ()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addFAQ = () => {
    if ($('#AddFAQForm')[0].checkValidity()) {
        const form = new FormData($('#AddFAQForm')[0]);

        $('#FAQ_Submit').prop('disabled', true);
        
        const FAQ_Category = $('#FAQ_Category').val();
        const FAQ_Question = $('#FAQ_Question').val();
        const FAQ_Answer = $('#FAQ_Answer').val();

        const data = {
            FAQ_Category: FAQ_Category,
            FAQ_Question: FAQ_Question,
            FAQ_Answer: FAQ_Answer,
        };
        
        $.ajax({
            type: 'POST',
            url: '/api/admin/addFAQ',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#FAQ_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add FAQ Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddFAQForm')[0].reset();
                        $('#AddFAQModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding FAQ. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#FAQ_Submit').prop('disabled', false);
        })
    }
}

getFAQ = () => {
    let faq_display = $('#faq')

    $.ajax({
        type: 'GET',
        url: '/api/admin/getFAQ',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const FAQdata = result;
            if (FAQdata.length > 0) {
                FAQdata.forEach((FAQdata) => {

                    let FAQformat = `
                    <div class="accordion-item">
                        <div class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${FAQdata.FAQ_Id}" aria-expanded="true"><h4>${FAQdata.FAQ_Question}</h4></button>
                        </div>
                        <div id="${FAQdata.FAQ_Id}" class="accordion-collapse collapse" data-bs-parent="#faq">
                            <div class="accordion-body pt-0">
                                <p>Category: <strong>${FAQdata.FAQ_Category}</strong></p>
                                <p>${FAQdata.FAQ_Answer}</p>
                                <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditFAQModal" onclick="foreditfaq('${FAQdata.FAQ_Id}')">Edit</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteFAQ('${FAQdata.FAQ_Id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_faq').html(null)
                        faq_display.append(FAQformat)
                });
            }
            else {
                notyf.success({
                    message: 'No FAQ Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'FAQ Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditfaq = (FAQ_Id) => getFAQforEdit(FAQ_Id)

getFAQforEdit = (FAQ_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getFAQInfo/${FAQ_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const getFAQdata = result;
            $('#edit_FAQ_Id').val(getFAQdata.FAQ_Id);
            $('#edit_FAQ_Category').val(getFAQdata.FAQ_Category);
            $('#edit_FAQ_Question').val(getFAQdata.FAQ_Question);
            $('#edit_FAQ_Answer').val(getFAQdata.FAQ_Answer);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'FAQ Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editFAQ = (FAQ_Id) => {
    if ($('#EditFAQForm')[0].checkValidity()) {
        const form = new FormData($('#EditFAQForm')[0]);

        $('#edit_FAQ_Submit').prop('disabled', true);
        
        const FAQ_Id = $('#edit_FAQ_Id').val();
        const FAQ_Category = $('#edit_FAQ_Category').val();
        const FAQ_Question = $('#edit_FAQ_Question').val();
        const FAQ_Answer = $('#edit_FAQ_Answer').val();

        const data = {
            FAQ_Category: FAQ_Category,
            FAQ_Question: FAQ_Question,
            FAQ_Answer: FAQ_Answer,
        };
        
        $.ajax({
            type: 'PUT',
            url: `/api/admin/editFAQ/${FAQ_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_FAQ_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit FAQ Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditFAQForm')[0].reset();
                        $('#EditFAQModal').modal('hide');
                            location.reload()
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving FAQ. Please try again.',
                icon: 'error',
                allowEnterKey: 'false',
                allowOutsideClick: 'false',
                allowEscapeKey: 'false',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#D40429',
            })
            $('#edit_FAQ_Submit').prop('disabled', false);
        })
    }
}

deleteFAQ = (FAQ_Id) => {

    Swal.fire({
        title: 'Delete FAQ',
        html: 'Are you sure do you want to delete this FAQ?',
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
                url: `/api/admin/deleteFAQ/${FAQ_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete FAQ Successfully',
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
                    text: 'Something went wrong while deleting FAQ. Please try again.',
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