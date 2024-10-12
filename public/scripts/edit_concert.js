function getConcert() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const Id = urlParams.get("id");

    return $.ajax({
        url: `/api_concerts/concert/${Id}`,
        method: "GET",
        dataType: "json",  // Expect a JSON response
        success: function(data) {
            return data[0];
        },
        error: function(xhr, status, error) {
            console.error("Error fetching concert:", error);
            return null;
        }
    });
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

    getConcert().done(function(data) {
        if (data) {
            $('#editConcertForm').attr('action', `/api_concerts/concert/${data._id}`);
            $('#artist_name').val(data.artist_name);
            $('#date').val(data.date);
            $('#hour').val(data.hour);
            $('#door_opening').val(data.door_opening);
            $('#location').val(data.location);
            $('#ticket_amount').val(data.ticket_amount);
            $('#price').val(data.price);
        }
    }).fail(function(xhr, status, error) {
        console.error("Error fetching concert:", error);
    });
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
    });
});