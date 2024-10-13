async function hashPassword(event) {
    console.log("entered hashpassword")
    event.preventDefault();
    const form = document.querySelector('form');
    const password = document.getElementById("password").value
    console.log("password: ", password)

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log("hashedPassword: ", hashedPassword)
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'password';
    hiddenInput.value = hashedPassword;
    form.appendChild(hiddenInput);

    document.getElementById("password").value = "";
    form.submit();
}