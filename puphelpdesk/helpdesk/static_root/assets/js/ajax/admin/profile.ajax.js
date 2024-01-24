$(function () {
    getadmininfo()    
})

getadmininfo = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getadminprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            if (profiledata.user_Middle_Name != null){
            $('#admin_Name').html(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name+", "+ profiledata.admin_Middle_Name);
            }
            else{
            $('#admin_Name').html(profiledata.admin_Last_Name+", "+ profiledata.admin_First_Name);
            }
            $('#admin_Contact').html(profiledata.admin_Contact);
            $('#admin_Email').html(profiledata.admin_Email);
            $('#admin_Gender').html(profiledata.admin_Gender);
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