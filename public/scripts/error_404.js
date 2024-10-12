function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        title: params.get('title') || 'Unknown Error',
        message: params.get('message') || 'Something went wrong. Please try again.'
    };
}

// Populate the error title and message dynamically
const { title, message } = getQueryParams();
document.getElementById('errorTitle').textContent = title;
document.getElementById('errorMessage').textContent = message;