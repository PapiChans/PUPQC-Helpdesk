$(function () {
    getUserManagement();
    getSPS();
})

const notyf = new Notyf();

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

function censorContact(contact) {
    // Check if the contact number is a string
    if (typeof contact === 'string') {
        // Check if the contact number has 11 digits
        if (contact.length === 11) {
            // Replace all but the first and last two digits with '*'
            return contact.substring(0, 2) + '*'.repeat(7) + contact.substring(9);
        } else {
            // If the contact number doesn't have 11 digits, return as it is
            return contact;
        }
    } else {
        // If the input is not a string, return it as it is
        return contact;
    }
}

getSPS= () => {
    const dt = $('#sps-user-datatable');

    $.ajaxSetup({
		headers: {'X-API-Key': "1b20e3f9-8d44-45b7-96da-02e8001d73e8"},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: 'https://student-performance-1.onrender.com/api/v1/university-admin/student/',
                contenttype: 'application/x-www-form-urlencoded',
                dataType: 'json',
                cache: false,
                headers: {'X-API-Key': "1b20e3f9-8d44-45b7-96da-02e8001d73e8"},
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const studentnum = data.StudentNumber
                        return `${studentnum}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const name = data.user_Last_Name + ", "+ data.user_First_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const gender = data.user_Gender
                        return `${gender}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const contact = data.user_Contact
                        return `${censorContact(contact)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const email = data.user_Email
                        return `${censorEmail(email)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const program = data.user_Program
                        return `${program}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}

getUserManagement = () => {
    const dt = $('#user-datatable');

    $.ajaxSetup({
		headers: {'X-CSRFToken': csrftoken},
	})

    if (dt.length) {
        dt.DataTable({
            ajax: {
                type: 'GET',
                url: '/api/admin/getUserManagement',
                ContentType: 'application/x-www-form-urlencoded',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const username = data.username
                        return `${username}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const name = data.user_Last_Name + ", "+ data.user_First_Name
                        return `${name}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const gender = data.user_Gender
                        return `${gender}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const contact = data.user_Contact
                        return `${censorContact(contact)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const email = data.user_Email
                        return `${censorEmail(email)}`
                    },
                },
                {
                    data: null,
                    class: 'text-center',
                    width: '10%',
                    render: (data) => {
                        const program = data.user_Program
                        return `${program}`
                    },
                },
            ],
            order: [[0, 'asc']],
        })
    }
}