$(function() {
    getLostItem();
})

const notyf = new Notyf();

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

    $.ajax({
        type: 'GET',
        url: '/api/admin/getLostItem',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const itemdata = result;
            if (itemdata.length > 0) {
                itemdata.forEach((itemdata) => {

                    let status = null;
                    let button = null;
                    let buttontext = null;

                    if (itemdata.item_Status == 'Missing') {
                        status = '<span class="badge bg-red text-red-fg">Missing</span>',
                        button = 'ItemMarkAsClaim',
                        buttontext = 'Claim Verification'
                    }
                    if (itemdata.item_Status == 'Claim Verification') {
                        status = '<span class="badge bg-info text-red-fg">Claim Verification</span>',
                        button = 'ItemMarkAsMissing',
                        buttontext = 'Missing'
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
                        <div class="mt-2 col text-center">
                            <div class="dropdown">
                            <button type="button" class="btn btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#LostItemInfoModal" onclick="getLostItemInfo('${itemdata.item_Id}')">Information</button>
                                <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown">
                                    Mark As
                                </button>
                                <div class="dropdown-menu">
                                    ${(itemdata.item_Status !== 'Claim Verification') ? `<a class="dropdown-item" onclick="${button}('${itemdata.item_Id}')">
                                    ${buttontext}
                                    </a>` : ``}
                                    <a class="dropdown-item" onclick="ItemMarkAsFound('${itemdata.item_Id}')">
                                    Found
                                    </a>
                                </div>
                            </div>
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
        url: `/api/admin/getLostItemInfo/${item_Id}`,
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
            $('#item_Image_info').attr('src', `${itemdata.item_Image}`);
            $('#item_Status_info').html(status);
            $('#item_Name_info').html(itemdata.item_Name);
            $('#item_Owner_info').html(itemdata.item_Owner);
            $('#item_Description_info').html(itemdata.item_Description.replace(/\n/g, '</p><p>'));
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

ItemMarkAsMissing = (item_Id) => {

    Swal.fire({
        title: 'Mark as "Missing"',
        html: 'Are you sure do you want to mark this as "Missing"?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, mark it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: `/api/admin/ItemMarkAsMissing/${item_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Item Marked Successfully',
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
                    text: 'Something went wrong while marking Lost Item post. Please try again.',
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

ItemMarkAsClaim = (item_Id) => {

    Swal.fire({
        title: 'Mark as "Claim Verification"',
        html: 'Are you sure do you want to mark this as "Claim Verfication"?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, mark it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: `/api/admin/ItemMarkAsClaim/${item_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Item Marked Successfully',
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
                    text: 'Something went wrong while marking Lost Item post. Please try again.',
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

ItemMarkAsFound = (item_Id) => {

    Swal.fire({
        title: 'Mark as "Found"',
        html: 'Are you sure do you want to mark this as "Found"?',
        icon: 'warning',
        allowEnterKey: 'false',
        allowOutsideClick: 'false',
        allowEscapeKey: 'false',
        confirmButtonText: 'Yes, mark it',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        cancelButtonClass: 'btn btn-danger w-xs mb-1',
        confirmButtonColor: '#D40429',
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: `/api/admin/ItemMarkAsFound/${item_Id}`,
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                success: (result) => {
                    if (result) {
                        notyf.success({
                            message: 'Item Marked Successfully',
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
                    text: 'Something went wrong while marking Lost Item post. Please try again.',
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
