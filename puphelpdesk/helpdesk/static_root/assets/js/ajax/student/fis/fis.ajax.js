$(function() {
    getFIS();
})

function censorEmail(email) {
    // Split the email address into local part and domain part
    var parts = email.split('@');
    var localPart = parts[0];
    var domainPart = parts[1];

    // Censor part of the local part
    var censoredLocalPart = localPart.substring(0, 1) + '*'.repeat(localPart.length - 2) + localPart.substring(localPart.length - 1);

    // Join the censored local part with the domain part
    var censoredEmail = censoredLocalPart + '@' + domainPart;

    return censoredEmail;
}

const notyf = new Notyf();
getFIS = () => {
    const dt = $('#fis-datatable');

    $.ajaxSetup({
        headers: {
            'Authorization': 'API-Key',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJjNmYzMDFjZTg3OWE0M2YwOWMyZWYyZjUzODk1YjY1OSJ9.L0Xs2-s2hAhnOuUEyciVLPHOHDtH3OAeC_UgoMP3X64', // Replace '(TOKEN_VARIABLE)' with the actual token variable from your .env
        },     
    });

    if (dt.length) {
        dt.DataTable({
            ajax: {
                url: 'https://pupqcfis-com.onrender.com/api/all/FISFaculty',
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                cache: false,
                headers: {'X-CSRFToken': csrftoken},
                dataSrc: (result) => {
                    const formattedData = [];
                    if (result && result.Faculties) {
                        Object.keys(result.Faculties).forEach((facultyId) => {
                            const faculty = result.Faculties[facultyId];
                            formattedData.push({
                                LastName: faculty.LastName,
                                FirstName: faculty.FirstName,
                                Degree: faculty.Degree,
                                FacultyType: faculty.FacultyType,
                                Rank: faculty.Rank,
                                PreferredSchedule: faculty.PreferredSchedule,
                                Email: faculty.Email,
                            });
                        });
                    }
                    return formattedData;
                },
            },
            columns: [
                {
                    data: null,
                    class: 'text-left',
                    width: '10%',
                    render: (data) => {
                        return `${data.LastName}, ${data.FirstName}`;
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `<span class="badge bg-info text-info-fg">${data.FacultyType}</span>`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.PreferredSchedule}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Rank}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${data.Degree}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        return `${censorEmail(data.Email)}`
                    },
                },
            ],
            order: [[0, 'asc']],
        });
    }
};