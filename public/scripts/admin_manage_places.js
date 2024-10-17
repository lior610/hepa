$(document).ready(function () {
    // Load places from the database when the page loads
    loadPlaces();

    // Call the setupValidation function
    setupValidation();
});

// Fetch all places from the database and display in the table
function fetchPlaces() {
    return $.ajax({
        url: "/api_places",
        method: "GET",
        dataType: "json"
    });
}

// Function to fetch places and populate the table
function loadPlaces() {
    fetchPlaces().done(function(places) {
        const tableBody = $('#placesTable tbody');
        tableBody.empty(); // Clear existing rows

        places.forEach(place => {
            const row = `
                <tr>
                    <td>${place.city}</td>
                    <td>${place.address}</td>
                    <td>${place.type}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editPlace('${place._id}')">Edit</button>
                        <button class="btn btn-remove" onclick="removePlace('${place._id}')">Remove</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error loading places:', textStatus, errorThrown);
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
        const city = $('#city').val();
        const address = $('#address').val();
        const type = $('#type').val();

        let errors = [];

        console.log("City:", city);
        console.log("Address:", address);
        console.log("Type:", type);
        // Validate type
        if (!(type === "indoors" || type === "outdoors")) {
            errors.push("Type can be only indoors or outdoors.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));  // Show errors
        } else {
            // Submit the form if no errors
            form.submit();
        }
    });

    console.log("Validation setup complete");
}

// Example Edit and Remove button functionality (stub)
function editPlace(placeId) {
    console.log('Edit place', placeId);
    window.location.href = `/edit_place.html?id=${placeId}`
    
}

function removePlace(placeId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this order?')) {
        $.ajax({
            url: `/api_places/place/${placeId}`, 
            type: 'DELETE',
            success: function() {
                location.reload();
            },
            error: function(error) {
                console.error('Error deleting place:', error);
                alert('Failed to delete place. Please try again.');
            }
        });
    }
}