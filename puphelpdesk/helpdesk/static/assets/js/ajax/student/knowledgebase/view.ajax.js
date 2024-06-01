$(function() {
    $(document).ready(function () {
        const topicNum = getTopicIdFromURL();
        const hasLiked = localStorage.getItem(`liked_${topicNum}`);
        const hasDisliked = localStorage.getItem(`disliked_${topicNum}`);
        
        // If the user has already liked or disliked the topic, clear the LikeResponse element
        if (hasLiked !== null || hasDisliked !== null) {
            let likeResponse = $('#LikeResponse');
            likeResponse.html(null);
        }
        if (topicNum) {
            getTopicInfo(topicNum);
        } else {
            window.location.href = '/Not_Found'
        }
    });
});

const notyf = new Notyf();

function getTopicIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('topic_Number');
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

getTopicInfo = (topic_Number) => {
    $.ajax({
        type: 'GET',
        url: `/api/guest/getKBTopicInfo/${topic_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            const data = result;
            $('#topic_Name').html(data.topic_Name)
            $('#LikesCount').html(data.likes)
            $('#DislikesCount').html(data.dislikes)
            
            // Convert Markdown content to HTML using ShowdownJS
            var converter = new showdown.Converter(),
                htmlContent = converter.makeHtml(data.topic_Content);
            $('#topic_Content').html(htmlContent);
            
            $('#get_Date_Created').html(formatPostgresTimestamp(data.date_Created) + ` (${formatTimeAgo(data.date_Created)})`)
            $('#get_Last_Modified').html(formatPostgresTimestamp(data.last_modified) + ` (${formatTimeAgo(data.date_Created)})`)

            
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Topic Info Fetching Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
        window.location.href = '/Not_Found'
    })
}

// Function to handle 'Yes' click
function handleYesClick() {
    let likeResponse = $('#LikeResponse');

    const topic_Number = getTopicIdFromURL();

    // Check if the topic has already been liked
    if (localStorage.getItem(`liked_${topic_Number}`)) {
        // If already liked, prevent further actions
        likeResponse.html(null);
        notyf.error({
            message: 'You have already liked this topic',
            position: {x:'right',y:'top'},
            duration: 2500
        });
        return;
    }

    // Clear existing content
    likeResponse.html(null);

    // Show loading spinner
    likeResponse.html('<div class="spinner-border text-blue" role="status"></div>');

    $.ajax({
        type: 'PUT',
        url: `/api/guest/putKBTopicLike/${topic_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            // Mark the topic as liked in local storage
            localStorage.setItem(`liked_${topic_Number}`, true);
            
            likeResponse.html(null);
            notyf.success({
                message: 'Thanks for your Feedback',
                position: {x:'right',y:'top'},
                duration: 2500
            });
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Topic Like Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })

}

// Function to handle 'No' click
function handleNoClick() {
    let likeResponse = $('#LikeResponse');

    const topic_Number = getTopicIdFromURL();

    // Check if the topic has already been disliked
    if (localStorage.getItem(`disliked_${topic_Number}`)) {
        // If already disliked, prevent further actions
        likeResponse.html(null);
        notyf.error({
            message: 'You have already disliked this topic',
            position: {x:'right',y:'top'},
            duration: 2500
        });
        return;
    }

    // Clear existing content
    likeResponse.html('');

    // Show loading spinner
    likeResponse.html('<div class="spinner-border text-blue" role="status"></div>');

    $.ajax({
        type: 'PUT',
        url: `/api/guest/putKBTopicDislike/${topic_Number}`,
        dataType: 'json',
        cache: false,
        headers: {'X-CSRFToken': csrftoken},
        success: (result) => {
            // Mark the topic as disliked in local storage
            localStorage.setItem(`disliked_${topic_Number}`, true);
            likeResponse.html(null);
            notyf.success({
                message: 'Thanks for your Feedback',
                position: {x:'right',y:'top'},
                duration: 2500
            });
        },
    })
    .fail(() => {
        notyf.error({
            message: 'Topic Dislike Error',
            position: {x:'right',y:'top'},
            duration: 2500
        });
    })
}


// Time difference Function
function formatTimeAgo(timestamp) {
    var currentTime = new Date();
    var jsDate = new Date(timestamp);
    var timeDifference = currentTime.getTime() - jsDate.getTime();

    var secondsDifference = Math.floor(timeDifference / 1000);
    var minutesDifference = Math.floor(secondsDifference / 60);
    var hoursDifference = Math.floor(minutesDifference / 60);
    var daysDifference = Math.floor(hoursDifference / 24);
    var weeksDifference = Math.floor(daysDifference / 7);
    var monthsDifference = Math.floor(daysDifference / 30);
    var yearsDifference = Math.floor(daysDifference / 365);

    var result;
    if (yearsDifference > 0) {
        result = yearsDifference + (yearsDifference === 1 ? " year ago" : " years ago");
    } else if (monthsDifference > 0) {
        result = monthsDifference + (monthsDifference === 1 ? " month ago" : " months ago");
    } else if (weeksDifference > 0) {
        result = weeksDifference + (weeksDifference === 1 ? " week ago" : " weeks ago");
    } else if (daysDifference > 0) {
        result = daysDifference + (daysDifference === 1 ? " day ago" : " days ago");
    } else if (hoursDifference > 0) {
        result = hoursDifference + (hoursDifference === 1 ? " hour ago" : " hours ago");
    } else if (minutesDifference > 0) {
        result = minutesDifference + (minutesDifference === 1 ? " minute ago" : " minutes ago");
    } else {
        result = "Just now";
    }

    return result;
}