function error() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const error = urlParams.get("error") 
    if(error) {
        if(error == 1) {
            document.getElementById("error").textContent = "Username or Password Incorrect, please try again."
        }
    }
}

error()