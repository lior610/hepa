async function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");
    try {
        const res = await fetch(`/api_concerts/concert/${Id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching concert:", error);
        return null;
    }
}

async function putData() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    if (!Id) {
        // Handle missing id parameter
        alert("Concert ID is missing. Redirecting to the home page.");
        window.location.href = "/homepage.html"; 
        return;
    }

    try {
        const res = await fetch(`/api_concerts/concert/${Id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await getConcert();
        document.getElementById("editConcertForm").action = `/api_concerts/concert/${data._id}`;
        document.getElementById("artist_name").value = data.artist_name;
        document.getElementById("date").value = data.date;
        document.getElementById("hour").value = data.hour;
        document.getElementById("door_opening").value = data.door_opening;
        document.getElementById("location").value = data.location;
        document.getElementById("ticket_amount").value = data.ticket_amount;
        document.getElementById("price").value = data.price;
    } catch (error) {
        console.error("Error fetching concert:", error);
    }
}

putData();

// Add the Change Picture button logic
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById('togglePicture');
    const pictureInput = document.getElementById('picture');

    let changePicture = false; // Default state is "Don't Change Picture"

    toggleButton.addEventListener('click', function () {
        changePicture = !changePicture;
        if (changePicture) {
            toggleButton.textContent = "Don't Change Picture"; // Change text to "Don't Change Picture"
            pictureInput.style.display = 'block';
            pictureInput.setAttribute('required', true); // Make the picture field required when changing
        } else {
            toggleButton.textContent = 'Change Picture'; // Change text to "Change Picture"
            pictureInput.style.display = 'none';
            pictureInput.value = ""; // Reset the file input if picture is not changing
            pictureInput.removeAttribute('required'); // Remove required if not changing
        }
    });

    const form = document.getElementById('editConcertForm');
    form.addEventListener('submit', function (event) {
        if (!changePicture) {
            pictureInput.value = null; // Send null if the picture is not changing
        }

        // Perform form validations
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validations fail
        }
    });
});

// Validation function
function validateForm() {
    const doorOpening = document.getElementById('door_opening').value;
    const hour = document.getElementById('hour').value;
    const ticketAmount = parseInt(document.getElementById('ticket_amount').value);
    const date = new Date(document.getElementById('date').value);
    const price = parseInt(document.getElementById('price').value);

    // door_opening can't be after "hour"
    if (doorOpening >= hour) {
        alert("Door opening cannot be after or at the concert time.");
        return false;
    }

    // ticket_amount can't be 0 or minus, minimum 1
    if (ticketAmount < 1) {
        alert("Ticket amount must be at least 1.");
        return false;
    }

    // date has to be tomorrow or further
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion
    if (date <= today) {
        alert("The concert date must be tomorrow or later.");
        return false;
    }

    // price can't be 0 or below, minimum 1
    if (price < 1) {
        alert("Price must be greater than 0.");
        return false;
    }

    return true; // Return true if all validations pass
}
