$(function () {
    getuserprofile()    
})

getuserprofile = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            $('#full_name').html(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
            if (profiledata.user_Profile != null){
                $('#profile_pic').attr('src', `${profiledata.user_Profile}`)
            }
            else {
                $('#profile_pic').attr('src', '/static/assets/avatars/blank_image.jpg')
            }
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