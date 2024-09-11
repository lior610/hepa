async function getConcerts(){
    const url = "/api_concerts/"
    const res = await fetch(url)
    const results = await res.json()
    for (let i = 0; i < results.length; i++ ) {
        let result = results[i]
        let concert = document.getElementById("tablerow").innerHTML;
        for (const key in result) {
            let data = "";
            //if (key=="ticket_amount" || key=="ticket_amount")
             //   break;
            if (typeof(result[key]) == "object") {
                for (const innerKey in result[key]) {
                    data += result[key][innerKey] + ", "
                }
            }
            else {
                data = result[key]
            }
            concert = concert.replace("{" + key + "}", data)
        }
        concert = concert.replace("{_id}", result["_id"])
        document.getElementById("tablebody").innerHTML += concert
    }
}

async function deleteConcert(id) {
    await fetch(`/api_concerts/concert/${id}`, {
        method: "DELETE",
    })
    window.location.href = "/test_indexConcert.html"
}

async function editConcert(id) {
    window.location.href = `/test_editconcert.html?id=${id}`
}

async function addConcert(id) {
    window.location.href = `/test_addconcert.html`
}

getConcerts()