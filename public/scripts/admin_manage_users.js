$(document).ready(function () {
    // Load users from the database when the page loads
    loadUsers();

    // Call the setupValidation function
    setupValidation();
});

// Fetch all users from the database and display in the table
function fetchUsers() {
    return $.ajax({
        url: "/api_users",
        method: "GET",
        dataType: "json"
    });
}

// Function to fetch users and populate the table
function loadUsers() {
    fetchUsers().done(function(users) {
        const tableBody = $('#usersTable tbody');
        tableBody.empty(); // Clear existing rows

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user._id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.mail}</td>
                    <td>${user.phone}</td>
                    <td>${user.address.number}</td>
                    <td>${user.address.street}</td>
                    <td>${user.address.city}</td>
                    <td>${user.gender}</td>
                    <td>${user.kind}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editUser('${user._id}')">Edit</button>
                        <button class="btn btn-remove" onclick="removeUser('${user._id}')">Remove</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading users:', textStatus, errorThrown);
    });
}

// Setup form validation and submission
function setupValidation() {
    const form = document.querySelector("form");

    if (!form) {
        console.log("Form not found!");
        return;
    }

    // Attach event listener for form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent form submission to handle validation

        // Fetch the values of the form fields dynamically when the form is submitted
        const full_name = $('#full_name').val();
        const username = $('#username').val();
        const password = $('#password').val();
        const confirm = $('#confirm ').val();
        const mail = $('#mail').val();
        const phone = $('#phone').val();
        const address_number = $('#address_number').val();
        const address_street = $('#address_street').val();
        const address_city = $('#address_city').val();
        const gender = $('#gender').val();
        const kind = $('#kind').val();

        let errors = [];

        if (errors.length > 0) {
            alert(errors.join("\n"));  // Show errors
        } else {
            // Submit the form if no errors
            form.submit();
        }
    });

}

// Example Edit and Remove button functionality (stub)
function editUser(userId) {
    console.log('Edit user', userId);
    window.location.href = `/edit_user.html?id=${userId}`;
}

function removeUser(userId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            url: `/api_users/user/${userId}`, 
            type: 'DELETE',
            success: function() {
                // Find the row in the table and remove it
                $(`#usersTable tbody tr`).filter(function() {
                    return $(this).find('td').first().text() === userId; // Match based on user ID
                }).remove();

                // Optionally, you can refresh the users table by re-fetching all users
                loadUsers();
            },
            error: function(error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        });
    }
}
