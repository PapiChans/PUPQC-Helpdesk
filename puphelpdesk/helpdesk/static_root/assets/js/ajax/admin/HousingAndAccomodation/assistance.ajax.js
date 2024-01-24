$(function() {
    $('#AddLivingAssistanceForm').on('submit', function (e) {
        addLivingAssistance()
        e.preventDefault() // prevent page refresh
    })
    getLivingAssistance();
    $('#EditLivingAssistanceForm').on('submit', function (e) {
        editLivingAssistance()
        e.preventDefault() // prevent page refresh
    })
});

const notyf = new Notyf();

addLivingAssistance = () => {
    if ($('#AddLivingAssistanceForm')[0].checkValidity()) {
        const form = new FormData($('#AddLivingAssistanceForm')[0]);
        
        const assistance_Type = $('#assistance_Type').val();
        const assistance_Name = $('#assistance_Name').val();
        const assistance_Description = $('#assistance_Description').val();
        const assistance_Link = $('#assistance_Link').val();

        const data = {
            assistance_Type: assistance_Type,
            assistance_Name: assistance_Name,
            assistance_Description: assistance_Description,
            assistance_Link: assistance_Link,
        };

        $.ajax({
            type: 'POST',
            url: '/api/admin/addLivingAssistance',
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#assistance_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Add Living Assistance Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#AddLivingAssistanceForm')[0].reset();
                        $('#AddLivingAssistanceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while adding Living Assistance. Please try again.',
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

getLivingAssistance = () => {
    let livingassistance_display = $('#livingassistance_display')

    notyf.open({
        message: 'Fetching Living Assistance',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: '/api/admin/getLivingAssistance',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const assistancedata = result;
            if (assistancedata.length > 0) {
                assistancedata.forEach((assistancedata) => {

                    let assistanceformat = `
                    <div class="col-xl-4">
                        <div class="card mb-2">
                            <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${assistancedata.assistance_Name} [${assistancedata.assistance_Type}]</h3>
                            <div class="card-body">
                                <p class="card-text font-size-15">${assistancedata.assistance_Description}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info waves-effect waves-light" onclick="window.open('${assistancedata.assistance_Link}','_blank')">Assistance Link</button>
                                    <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#EditLivingAssistanceModal" onclick="foreditlivingassistance('${assistancedata.assistance_Id}')">Edit</button>
                                    <button type="button" class="btn btn-danger waves-effect waves-light" onclick="deleteLivingAssistance('${assistancedata.assistance_Id}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_LivingAssistance').html(null)
                        livingassistance_display.append(assistanceformat)
                });
                notyf.success({
                    message: 'All Living Assistance Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
            else {
                notyf.success({
                    message: 'No Living Assistance Available',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Job Living Assistance Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

foreditlivingassistance = (assistance_Id) => getLivingAssistanceforEdit(assistance_Id)

getLivingAssistanceforEdit = (assistance_Id) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getLivingAssistanceInfo/${assistance_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const assistancedata = result;
            $('#edit_assistance_Id').val(assistancedata.assistance_Id);
            $('#edit_assistance_Type').val(assistancedata.assistance_Type);
            $('#edit_assistance_Name').val(assistancedata.assistance_Name);
            $('#edit_assistance_Description').val(assistancedata.assistance_Description);
            $('#edit_assistance_Link').val(assistancedata.assistance_Link);
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Living Assistance Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}

editLivingAssistance = (assistance_Id) => {
    if ($('#EditLivingAssistanceForm')[0].checkValidity()) {
        const form = new FormData($('#EditLivingAssistanceForm')[0]);
        
        const assistance_Id = $('#edit_assistance_Id').val();
        const assistance_Type = $('#edit_assistance_Type').val();
        const assistance_Name = $('#edit_assistance_Name').val();
        const assistance_Description = $('#edit_assistance_Description').val();
        const assistance_Link = $('#edit_assistance_Link').val();

        const data = {
            assistance_Type: assistance_Type,
            assistance_Name: assistance_Name,
            assistance_Description: assistance_Description,
            assistance_Link: assistance_Link,
        };

        $.ajax({
            type: 'PUT',
            url: `/api/admin/editLivingAssistance/${assistance_Id}`,
            data: data,
            dataType: 'json',
            headers: {'X-CSRFToken': csrftoken},
            success: (result) => {
                if (result) {
                    $('#edit_job_Search_Submit').prop('disabled', true);
                    notyf.success({
                        message: 'Edit Living Assistance Successfully',
                        position: {x:'right',y:'top'},
                        duration: 2500
                    })
                        $('form#EditLivingAssistanceForm')[0].reset();
                        $('#EditLivingAssistanceModal').modal('hide');
                        setTimeout(function () {
                            location.reload()
                        }, 2600);
                }
            },
        })
        .fail(() => {
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong while saving Living Assistance. Please try again.',
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

deleteLivingAssistance = (assistance_Id) => {

    Swal.fire({
        title: 'Delete Living Assistance',
        html: `Are you sure do you want to delete this Living Assistance?`,
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
                url: `/api/admin/deleteLivingAssistance/${assistance_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Delete Living Assistance Successfully',
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
                    text: 'Something went wrong while deleting Living Assistance. Please try again.',
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