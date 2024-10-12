$(document).ready(function () {
    // Load places from the database when the page loads
    loadPlaces();

    // Add event listener to the form for adding a new place
    //$('#addPlaceForm').on('submit', function (event) {
    //    event.preventDefault();
    //    addPlace();
    //});
});

// Fetch all places from the database and display in the table
function fetchPlaces() {
    return $.ajax({
        url: "/api_places",
        method: "GET",
        dataType: "json"
    });
}

// Function to fetch orders and populate the table
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

// Edit an existing place
function editPlace(placeId) {
        $.ajax({
            url: `/api_places/place/${placeId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedPlace),
            success: function (data) {
                loadPlaces(); // Reload the table with updated places
            },
            error: function (error) {
                console.error('Error updating place:', error);
            }
        });
    }

// Remove a place from the database
function removePlace(placeId) {
    if (confirm('Are you sure you want to remove this place?')) {
        $.ajax({
            url: `/api_places/place/${placeId}`,
            method: 'DELETE',
            success: function (data) {
                alert('Place removed successfully!');
                loadPlaces(); // Reload the table with updated places
            },
            error: function (error) {
                console.error('Error removing place:', error);
            }
        });
    }
}
const form = document.querySelector("form");
console.log(form)

function setupValidation() {
    const city = $('#city').val();
    const address = $('#address').val();
    const type = $('#type').val();

    if (!form) {
        console.log("Form not found!");
        return;
    }

    // Attach event listener for form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let errors = [];
        console.log(form)
        console.log("type: ", type)
        console.log("city: ", city)
        if (!(type == "indoors" || type == "outdoors")) {
            console.log("type not good")
            errors.push("type can be only indoors or outdoors.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
        } else {
            // Submit the form if no errors
            form.submit();
        }
    });

    console.log("Validation setup complete");
}