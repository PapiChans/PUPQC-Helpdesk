$(function () {
    getuserinfo()    
})

getuserinfo = () => {
    $.ajax({
        type: 'GET',
        url: `/api/auth/getuserprofile`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const profiledata = result;
            if (profiledata.user_Middle_Name != null){
            $('#student_Name').html(profiledata.user_Last_Name+", "+ profiledata.user_First_Name+", "+ profiledata.user_Middle_Name);
            }
            else{
            $('#student_Name').html(profiledata.user_Last_Name+", "+ profiledata.user_First_Name);
            }
            $('#student_Program').html(profiledata.user_Program);
            $('#student_Contact').html(profiledata.user_Contact);
            $('#student_Email').html(profiledata.user_Email);
            $('#student_Gender').html(profiledata.user_Gender);
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