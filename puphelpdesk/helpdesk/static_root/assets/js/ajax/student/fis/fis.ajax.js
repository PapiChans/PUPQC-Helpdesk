$(function() {
    getaccreditation();
})

const notyf = new Notyf();

getaccreditation = () => {
    let service_display = $('#service_display')

    notyf.open({
        message: 'Fetching Service',
        position: {x:'right',y:'top'},
        background: 'gray',
        duration: 3000
    });

    $.ajax({
        type: 'GET',
        url: 'https://pupqcfis-com.onrender.com/api/all/FISFaculty',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
    
            const servicedata = result;
            if (servicedata.Faculties) {
                Object.keys(servicedata.Faculties).forEach((facultyId) => {
                    const faculty = servicedata.Faculties[facultyId];

                    let type = faculty.FacultyType
                    if (faculty.FacultyType === 'Part Time'){
                        type = '<span class="badge bg-success text-success-fg">Part Time</span>'
                    }
                    else if (faculty.FacultyType === 'Full Time') {
                        type = `<span class="badge bg-info text-success-fg">Full Time</span>`
                    }
                    else {
                        type = `<span class="badge bg-secondary text-secondary-fg">Unknown</span>`
                    }
    
                    let serviceformat = `
                        <div class="col-xl-4">
                            <div class="card mb-2">
                                <h3 class="card-header bg-transparent border-bottom mt-0 text-primary">${faculty.LastName}, ${faculty.FirstName} [${faculty.Rank}]</h3>
                                <div class="card-body">
                                    <p>Degree: <strong>${faculty.Degree}</strong></p>
                                    <p>Faculty Type: <strong>${type}</strong></p>
                                </div>
                                <div class="card-footer">
                                    <p class="card-text font-size-15">Schedule: ${faculty.PreferredSchedule}</p>
                                </div>
                            </div>
                        </div>`;
                    
                        service_display.append(serviceformat)
                });
                notyf.success({
                    message: 'Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            } else {
                notyf.success({
                    message: 'No Service Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
                $('#no_Display').html("No Service Data");
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Service Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    });
    
}