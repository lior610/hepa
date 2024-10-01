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
    const data = await getConcert();
    document.getElementById("editConcertForm").action = `/api_concerts/concert/${data._id}`
    document.getElementById("artist_name").value = data.artist_name;
    document.getElementById("date").value = data.date;
    document.getElementById("hour").value = data.hour;
    document.getElementById("door_opening").value = data.door_opening;
    document.getElementById("location").value = data.location;
    document.getElementById("ticket_amount").value = data.ticket_amount;
}

async function submit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    res = await fetch(`/api_concerts/concert/${id}`, {
        method: "POST"
    })

    window.location.href("/")
}

putData();