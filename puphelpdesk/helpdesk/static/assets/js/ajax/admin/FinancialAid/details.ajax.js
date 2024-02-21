$(function() {
})

const notyf = new Notyf();

// Date Formatter
function formatDate(inputDate) {
    const date = new Date(inputDate);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

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

function getGuideIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guide_number');
}

$(document).ready(function () {
    const guideId = getGuideIdFromURL();
    if (guideId) {
        getGuideInfo(guideId);
    } else {
        console.error('Guide Number not found in the URL');
    }
});

getGuideInfo = (guide_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/admin/getGuideInfo/${guide_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const guidedata = result;

            $('#financial_program').html(guidedata.guide_Program);
            $('#financial_description').html(guidedata.guide_Description.replace(/\n/g, '</p><p>'));
            $('#financial_apply').html(guidedata.guide_Apply.replace(/\n/g, '</p><p>'));
            $('#financial_submit').html(guidedata.guide_Submit.replace(/\n/g, '</p><p>'));
            $('#financial_contact').html(guidedata.guide_Contact.replace(/\n/g, '</p><p>'));
            $('#financial_deadline').html(formatDate(guidedata.guide_Deadline_Start)+" - "+formatDate(guidedata.guide_Deadline_End));
            $('#financial_remarks').html(guidedata.guide_Remarks.replace(/\n/g, '</p><p>'));
            
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Guide Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}