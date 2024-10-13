async function getUser() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    try {
        const res = await fetch(`/api_users/user/${id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

async function populateForm() {
    const data = await getUser();
    if (data) {
        document.getElementById("editUserForm").action = `/api_users/user/admin_edit_details/${data._id}`;
        document.getElementById("full_name").value = data.full_name;
        document.getElementById("username").value = data._id;
        document.getElementById("mail").value = data.mail;
        document.getElementById("phone").value = data.phone;
        document.getElementById("address_number").value = data.address.number;
        document.getElementById("address_street").value = data.address.street;
        document.getElementById("address_city").value = data.address.city;
        document.getElementById("gender").value = data.gender;
        document.getElementById("kind").value = data.kind;
    }
}

// Toggle Password Fields
$(document).ready(function() {
    let changePassword = false;
    const toggleButton = $('#togglePassword');
    const passwordInput = $('#password');
    const confirmInput = $('#confirm');

    toggleButton.on('click', function() {
        changePassword = !changePassword;
        if (changePassword) {
            toggleButton.text("Change Password");
            passwordInput.show().attr('required', true);
            confirmInput.show().attr('required', true);
        } else {
            toggleButton.text("Don't Change Password");
            passwordInput.hide().val("").removeAttr('required');
            confirmInput.hide().val("").removeAttr('required');
        }
    });

    $('#editUserForm').on('submit', function(event) {
        if (!changePassword) {
            passwordInput.val(null);  // Set password to null if not changing
            confirmInput.val(null);   // Set confirm password to null if not changing
        }

        // Allow password.js to run its validation on form submit
    });
});

populateForm();
