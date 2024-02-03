$(function() {
    getFAQ();
});

const notyf = new Notyf();

getFAQ = () => {
    let faq_display = $('#faq')

    $.ajax({
        type: 'GET',
        url: '/api/student/getFAQ',
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            notyf.dismissAll();
            const FAQdata = result;
            if (FAQdata.length > 0) {
                FAQdata.forEach((FAQdata) => {

                    let FAQformat = `
                    <div class="accordion-item">
                        <div class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${FAQdata.FAQ_Id}" aria-expanded="true"><h4>${FAQdata.FAQ_Question}</h4></button>
                        </div>
                        <div id="${FAQdata.FAQ_Id}" class="accordion-collapse collapse" data-bs-parent="#faq">
                            <div class="accordion-body pt-0">
                                <p>Category: <strong>${FAQdata.FAQ_Category}</strong></p>
                                <p>${FAQdata.FAQ_Answer}</p>
                            </div>
                        </div>
                    </div>
                        `;

                        $('#no_faq').html(null)
                        faq_display.append(FAQformat)
                });
            }
            else {
                notyf.success({
                    message: 'No FAQ Fetched.',
                    position: {x:'right',y:'top'},
                    duration: 2500
                });
            }
        },
    })
    .fail(() => {
        notyf.error({
            message: 'FAQ Fetched Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}