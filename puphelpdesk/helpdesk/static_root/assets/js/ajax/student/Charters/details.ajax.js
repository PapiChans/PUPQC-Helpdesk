$(function () {
})

const notyf = new Notyf();

function getNumberFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('charter_number');
}

$(document).ready(function () {
    const number = getNumberFromURL();
    if (number) {
        getCharterInfo(number);
    } else {
        console.error('Charter Number not found in the URL');
    }
});

getCharterInfo = (charter_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/student/getCharterNumberInfo/${charter_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;

            $('#charter_Id').val(data.charter_Id);

            getCharterStep(data.charter_Id)

            $('#charter_Title_info').html(data.charter_Title);
            $('#charter_Description_info').html(data.charter_Description.replace(/\n/g, '</p><p>'));
            $('#charter_Office_info').html(data.charter_Office);
            $('#charter_Classification_info').html(data.charter_Classification);
            $('#charter_Transaction_info').html(data.charter_Transaction);
            $('#charter_Avail_info').html(data.charter_Avail);
            $('#charter_Requirements_info').html(data.charter_Requirements.replace(/\n/g, '</p><p>'));
            $('#charter_Secure_info').html(data.charter_Secure.replace(/\n/g, '</p><p>'));
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

getCharterStep = (charter_Id) => {
    let step_Display = $('#step_Display')

    $.ajax({
        type: 'GET',
        url: `/api/student/getCharterStep/${charter_Id}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const data = result;
            if (data.length > 0) {
                data.forEach((data) => {

                    let charterstepformat = `
                    <tr>
                        <td>${data.step_Client.replace(/\n/g, '</p><p>')}</td>
                        <td>${data.step_Agency.replace(/\n/g, '</p><p>')}</td>
                        <td class="text-center">${data.step_Fees}</td>
                        <td class="text-center">${data.step_Time}</td>
                        <td>${data.step_Person.replace(/\n/g, '</p><p>')}</td>
                    </tr>
                        `;

                    step_Display.append(charterstepformat)

                });
            }
            else {
                notyf.success({
                    message: 'No Charter Step Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Charter Step Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}