if (typeof allUsers === 'undefined') {
    let allUsers = []; // Declare it if it hasn't been declared
    let partUsers = [];
    let index;
}

index = 6;

// Fetch all users from the database and display in the table
function fetchUsers() {
    return $.ajax({
        url: "/api_users",
        method: "GET",
        dataType: "json"
    });
}

// Function to fetch users and populate the table
function loadUsers(users) {
    const parent = $('#card-row');
    parent.empty(); // Clear existing rows

    users.forEach(user => {
        const card = `
            <div class="col-lg-4 col-md-6 col-sm-12 col-12 d-flex mb-4">
                <div class="card regular-card text-center w-100 p-2"> <!-- Reduced padding with p-2 -->
                    <div class="card-body regular-card-body p-2"> <!-- Reduced padding with p-2 -->
                        <h5 class="card-title regular-card-title mb-2">${user.full_name}</h5> <!-- Less margin with mb-2 -->
                        <p class="card-text regular-text mb-1">ID: ${user._id}</p> <!-- Less margin with mb-1 -->
                        <p class="card-text regular-text mb-1">Mail: ${user.mail}</p>
                        <p class="card-text regular-text mb-1">Phone: ${user.phone}</p>
                        <p class="card-text regular-text mb-1">Address: ${user.address.number} ${user.address.street}, ${user.address.city}</p>
                        <p class="card-text regular-text mb-1">Gender: ${user.gender}</p>
                        <p class="card-text regular-text mb-1">Type: ${user.kind}</p>
                        <button type="button" class="btn btn-primary my-1 card-butn" onclick="editUser('${user._id}')">Edit</button> <!-- Small button with btn-sm -->
                        <button type="button" class="btn btn-primary my-1 card-butn" onclick="removeUser('${user._id}')">Remove</button> <!-- Small button with btn-sm -->
                    </div>
                </div>
            </div>
`;

        parent.append(card);
    })
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

function applyFilters() {
    const username = $('#name').val().toLowerCase();
    const city = $('#city').val().toLowerCase();
    const gender = $('#genderFilter').val();
    const type = $('#type').val();
    let filtered_users = allUsers.filter(e => {
        const usernameMatch = username === "" || e._id.toLowerCase().includes(username) || e.full_name.toLowerCase().includes(username)
        const cityMatch = city == "" || e.address.city.toLowerCase().includes(city)
        const genderMatch = gender == "" || gender == e.gender;
        const typeMatch = type == "" || type == e.kind;
        return usernameMatch && cityMatch && genderMatch && typeMatch;
    })
    loadUsers(filtered_users)
    hideLoadMoreButton();
}

function clearFilters() {
    loadUsers(partUsers);
    if (index <= allUsers.length) {
        showLoadMoreButton();
    }
}

function showLoadMoreButton() {
    $('#load-more').show();
}

function hideLoadMoreButton() {
    $('#load-more').hide();
}

// Load more concerts
function loadMoreUsers() {
    index += 6;
    partUsers = allUsers.slice(0, index);
    loadUsers(partUsers);
    if (index >= allUsers.length) {
        hideLoadMoreButton();
    } else {
        showLoadMoreButton();
    }
}

$(document).ready(function() {
    fetchUsers().done((users) => { 
        partUsers = users.slice(0, index);
        loadUsers(partUsers);
        allUsers = users;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading users:', textStatus, errorThrown);
    });
    setupValidation();
});