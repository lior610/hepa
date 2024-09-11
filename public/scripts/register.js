let emailValid = false;
let passwordValid = false;
let phoneValid = false;

function validateEmail() {
    var email = document.getElementById('mail').value;
    const errorElement = document.getElementById('emailError');
    
    // Basic email validation
    var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailPattern.test(email)) {
        errorElement.textContent = 'Please enter a valid email address.';
        emailValid = false
    } else {
        errorElement.textContent = '';
        emailValid = true
    }
}

function validatePhone() {
    var phone = document.getElementById('phone').value;
    const errorElement = document.getElementById('phoneError');

    // Basic phone number validation
    if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
        errorElement.textContent = 'Please enter a valid 10-digit phone number.';
        phoneValid = false;
    } else {
        errorElement.textContent = '';
        phoneValid = true;
    }
}

function confirmPassword () {
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const errorElement = document.getElementById('passwordError');

    if (password.value != confirm.value) {
        errorElement.textContent = 'Passwords do not match!';
        passwordValid = false;
    } else {
        errorElement.textContent = '';
        passwordValid = true
    }
}

function submitButton() {
    const submit = document.getElementById("submit-button")
    console.log("password " + passwordValid)
    console.log("phone " + phoneValid)
    console.log("mail " + emailValid)
    if (passwordValid && emailValid && phoneValid) {
        submit.classList.remove("disabled")
    } else {
        submit.classList.add("disabled")
    }
}

document.getElementById('mail').addEventListener('input', () => {
    validateEmail();
    submitButton();
});
document.getElementById('phone').addEventListener('input', () => {
    validatePhone();
    submitButton();
});

document.getElementById('password').addEventListener('input', () => {
    confirmPassword();
    submitButton();
});
document.getElementById('confirm').addEventListener('input', () => {
    confirmPassword();
    submitButton();
});