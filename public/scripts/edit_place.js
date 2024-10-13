
async function getPlace() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    try {
        const res = await fetch(`/api_places/place/${id}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Error fetching place:", error);
        return null;
    }
}

async function populateForm() {
    const data = await getPlace(); 
    if (data) {
        document.getElementById("editPlaceForm").action = `/api_places/place/${data._id}`;
        document.getElementById("city").value = data.city;
        document.getElementById("address").value = data.address;
        document.getElementById("type").value = data.type;
    }
}

populateForm();