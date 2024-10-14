function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    return $.ajax({
        url: `/api_concerts/concert/${Id}`,
        method: "GET",
        dataType: "json",  // Expect a JSON response
        success: function (data) {
            return data[0];
        },
        error: function (xhr, status, error) {
            console.error("Error fetching concert:", error);
            return null;
        }
    });
}

function putData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    if (!Id) {
        alert("Concert ID is missing. Redirecting to the home page.");
        window.location.href = "/admin.html";
        return;
    }

    getConcert().done(function (data) {
        if (data) {
            $('#editConcertForm').attr('action', `/api_concerts/concert/${data[0]._id}`);
            $('#artist_name').val(data[0].artist_name);
            $('#date').val(data[0].date);
            $('#hour').val(data[0].hour);
            $('#door_opening').val(data[0].door_opening);
            $('#location').val(data[0].location);
            $('#ticket_amount').val(data[0].ticket_amount);
            $('#price').val(data[0].price);
        }
    }).fail(function (xhr, status, error) {
        console.error("Error fetching concert:", error);
    });
}

putData();

// Add the Change Picture button logic
$(document).ready(function () {
    const toggleButton = $('#togglePicture');
    const pictureInput = $('#picture');

    let changePicture = false;

    toggleButton.on('click', function () {
        changePicture = !changePicture;
        if (changePicture) {
            toggleButton.text("Don't Change Picture");
            pictureInput.show().attr('required', true);
        } else {
            toggleButton.text('Change Picture');
            pictureInput.hide().val("").removeAttr('required');
        }
    });

    $('#editConcertForm').on('submit', function (event) {
        if (!changePicture) {
            pictureInput.val(null); // Send null if the picture is not changing
        }

        // Perform form validations
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validations fail
        }
    });
});

// Validation function
function validateForm() {
    const doorOpening = $('#door_opening').val();
    const hour = $('#hour').val();
    const ticketAmount = parseInt($('#ticket_amount').val());
    const date = new Date($('#date').val());
    const price = parseInt($('#price').val());

    // door_opening can't be after "hour"
    if (doorOpening >= hour) {
        alert("Door opening cannot be after or at the concert time.");
        return false;
    }

    // ticket_amount can't be 0 or less, minimum 1
    if (ticketAmount < 1) {
        alert("Ticket amount must be at least 1.");
        return false;
    }

    // date has to be tomorrow or later
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion
    if (date <= today) {
        alert("The concert date must be tomorrow or later.");
        return false;
    }

    // price can't be 0 or less, minimum 1
    if (price < 1) {
        alert("Price must be greater than 0.");
        return false;
    }

    return true; // Return true if all validations pass
}

async function enterCities() {
    const url = "/api_places/"
    const res = await fetch(url);
    const places = await res.json();
    const locationSelect = document.getElementById("location");
    places.map(location => location.city).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        locationSelect.appendChild(option);
      });
}

enterCities()
