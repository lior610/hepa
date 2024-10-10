function initMap() {
    // Initialize the map centered on a default location
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 31.0461, lng: 34.8516 }, // Centered on Israel
        zoom: 8,
        mapId: 'a6fb15e491a008ad',
    });

    // fetch place locations (city + address) from the server
    $.ajax({
        url: 'http://localhost/api_places/concert-locations',
        method: 'GET',
        dataType: 'json', // Expecting a JSON response
        success: function(data) {
            // Create an InfoWindow for displaying address
            const infoWindow = new google.maps.InfoWindow();

            // Geocode each place and place a marker
            data.forEach(place => {
                const fullAddress = `${place.city}, ${place.address}`; // Combine city and address

                // Use Geocoding API to get coordinates for each place
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: fullAddress }, (results, status) => {
                    if (status === 'OK') {
                        // Create a default marker for each location
                        const marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: fullAddress,
                        });

                        // Add a click listener to show the address in the InfoWindow
                        marker.addListener('click', () => {
                            infoWindow.setContent(fullAddress); // Set the content of the InfoWindow
                            infoWindow.open(map, marker); // Open the InfoWindow at the marker position
                        });
                    } else {
                        console.error('Geocode failed: ' + status);
                    }
                });
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching place locations:', textStatus, errorThrown);
        }
    });
}

window.initMap = initMap;
