document.addEventListener('DOMContentLoaded', () => {
    // Load places from the database when the page loads
    fetchPlaces();

    // Add event listener to the form for adding a new place
    const addPlaceForm = document.getElementById('add-place-form');
    addPlaceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addPlace();
    });
});

// Fetch all places from the database and display in the table
function fetchPlaces() {
    fetch('/api/places') // Adjust the endpoint based on your API
        .then(response => response.json())
        .then(places => {
            const placesTableBody = document.getElementById('places-table-body');
            placesTableBody.innerHTML = ''; // Clear the table body before adding new rows

            places.forEach(place => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${place.city}</td>
                    <td>${place.type}</td>
                    <td>${place.address}</td>
                    <td>
                        <button class="btn btn-warning btn-edit" onclick="editPlace('${place._id}')">Edit</button>
                        <button class="btn btn-danger btn-delete" onclick="removePlace('${place._id}')">Remove</button>
                    </td>
                `;

                placesTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching places:', error));
}

// Add a new place to the database
function addPlace() {
    const city = document.getElementById('city').value;
    const type = document.getElementById('type').value;
    const address = document.getElementById('address').value;

    const placeData = { city, type, address };

    fetch('/api/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Place added successfully!');
            document.getElementById('add-place-form').reset();
            fetchPlaces(); // Reload the table with the updated places
        })
        .catch(error => console.error('Error adding place:', error));
}

// Edit an existing place
function editPlace(placeId) {
    const city = prompt('Enter new city name:');
    const type = prompt('Enter new place type:');
    const address = prompt('Enter new address:');

    if (city && type && address) {
        const updatedPlace = { city, type, address };

        fetch(`/api/places/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlace)
        })
            .then(response => response.json())
            .then(data => {
                alert('Place updated successfully!');
                fetchPlaces(); // Reload the table with updated places
            })
            .catch(error => console.error('Error updating place:', error));
    }
}

// Remove a place from the database
function removePlace(placeId) {
    if (confirm('Are you sure you want to remove this place?')) {
        fetch(`/api/places/${placeId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert('Place removed successfully!');
                fetchPlaces(); // Reload the table with updated places
            })
            .catch(error => console.error('Error removing place:', error));
    }
}
