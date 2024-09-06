document.getElementById('addConcert').onsubmit = function() {

//new validations - are they needed? the form blocks most if not all of them. check 

    var email = document.getElementById('mail').value;
    var phone = document.getElementById('phone').value;
    
    // Basic email validation
    var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Basic phone number validation
    if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }

    return true; // Allow form submission
}