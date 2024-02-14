$(function() {
    getFIS();
})

const notyf = new Notyf();

getFIS = () => {
    const dt = $('#fis-datatable');

    $.ajaxSetup({
        headers: {'X-CSRFToken': csrftoken},
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
                        return `${data.Degree}`
                    },
                },
                {
                    data: null,
                    width: '10%',
                    class: 'text-center',
                    render: (data) => {
                        let type = data.FacultyType
                            if (data.FacultyType === 'Part Time'){
                                type = '<span class="badge bg-success text-success-fg">Part Time</span>'
                            }
                            else if (data.FacultyType === 'Full Time') {
                                type = `<span class="badge bg-info text-success-fg">Full Time</span>`
                            }
                            else {
                                type = `<span class="badge bg-secondary text-secondary-fg">Unknown</span>`
                            }
                        return `${type}`
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
                        return `${data.PreferredSchedule}`
                    },
                },
            ],
            order: [[0, 'asc']],
        });
    }
};

