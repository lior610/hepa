async function getConcerts(){
    const url = "/api/"
    const res = await fetch(url)
    const results = await res.json()
    console.log(results)
    for (let i = 0; i < results.length; i++ ) {
        let result = results[i]
        let concert = document.getElementById("tablerow").innerHTML;
        for (const key in result) {
            let data = "";
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
    await fetch(`/api/concert/${id}`, {
        method: "DELETE",
    })
    window.location.href = "/"
}

async function editConcert(id) {
    window.location.href = `/editconcert.html?id=${id}`
}
getConcerts()