concerts = [
    {
        "artist": "David Guetta",
        "date": "2024-09-15",
        "time": "21:00",
        "city": "Tel Aviv",
        "price": 350,
        "picture_link": "https://edm.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc1NDk1MDg4ODcxMzE4NjQ3/david-guetta-live.jpg",
        "recommended": true
    },
    {
        "artist": "Fred Again...",
        "date": "2024-09-22",
        "time": "20:30",
        "city": "Jerusalem",
        "price": 450,
        "picture_link": "https://framerusercontent.com/images/pHcVw2ChtBSjjnm96eYHPsCRQ.jpg",
        "recommended": true
    },
    {
        "artist": "Calvin Harris",
        "date": "2024-09-28",
        "time": "22:00",
        "city": "Haifa",
        "price": 400,
        "picture_link": "https://cdns-images.dzcdn.net/images/artist/566c5a0826b2981a396850ad6ab54429/1900x1900-000000-80-0-0.jpg",
        "recommended": false
    },
    {
        "artist": "Led Zeppelin Tribute Band",
        "date": "2024-10-02",
        "time": "19:30",
        "city": "Beer Sheva",
        "price": 300,
        "picture_link": "https://cdn.britannica.com/47/243647-050-7C88FBF5/Led-Zeppelin-1968-studio-portrait-John-Bohham-Jimmy-Page-Robert-Plant-John-Paul-Jones.jpg",
        "recommended": false
    },
    {
        "artist": "Fisher",
        "date": "2024-10-05",
        "time": "23:00",
        "city": "Eilat",
        "price": 500,
        "picture_link": "https://production-dubainight.s3.me-south-1.amazonaws.com/region_dubai/article/FISHER-to%20-9336-2023-12-20.jpeg",
        "recommended": false
    },
    {
        "artist": "Pink Floyd Tribute Band",
        "date": "2024-10-10",
        "time": "20:00",
        "city": "Tel Aviv",
        "price": 350,
        "picture_link": "https://cdn.britannica.com/64/23164-050-A7D2E9D9/Pink-Floyd.jpg",
        "recommended": true
    },
    {
        "artist": "Swedish House Mafia",
        "date": "2024-10-15",
        "time": "22:30",
        "city": "Jerusalem",
        "price": 420,
        "picture_link": "https://www.everythinglubbock.com/wp-content/uploads/sites/35/2021/10/6feda417e0694f07a516fbd9c3ab5fa2.jpg",
        "recommended": false
    },
    {
        "artist": "The Beatles Tribute Band",
        "date": "2024-10-20",
        "time": "19:00",
        "city": "Haifa",
        "price": 280,
        "picture_link": "https://cdn.britannica.com/18/136518-050-CD0E49C6/The-Beatles-Ringo-Starr-Paul-McCartney-George.jpg",
        "recommended": false
    },
    {
        "artist": "Martin Garrix",
        "date": "2024-10-25",
        "time": "21:30",
        "city": "Beer Sheva",
        "price": 470,
        "picture_link": "https://edm.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTcwMjMwMjMyNTk3NDA3MDU1/martin-garrix.jpg",
        "recommended": false
    },
    {
        "artist": "Queen Tribute Band",
        "date": "2024-10-30",
        "time": "20:00",
        "city": "Eilat",
        "price": 380,
        "picture_link": "https://englishnews.eu/wp-content/uploads/2022/01/queen-1973.jpg",
        "recommended": false
    }
]

function deploy(recommended, templateId, parentId, filterdConcerts) {
    if (!recommended) {
        document.getElementById(parentId).innerHTML = "";
    }
    console.log(filterdConcerts)
    for (let i = 0; i < filterdConcerts.length; i++ ) {
        let concert = filterdConcerts[i]
        let template = document.getElementById(templateId).innerHTML
        for (const key in concert) {
            let data = "";
            if (typeof(concert[key]) == "object") {
                for (const innerKey in concert[key]) {
                    data += concert[key][innerKey] + ", "
                }
            }
            else {
                data = concert[key]
            }
            template = template.replace("{" + key + "}", data)
        }
        document.getElementById(parentId).innerHTML += template;
    }
    if (recommended) {
        document.getElementsByClassName("carousel-item")[0].classList.add("active")
    }
}

function applyFilters() {
    const city = document.getElementById('city').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;


    let filtered_concerts = concerts.filter(e => {
        const concertDate = new Date(e.date);
        const cityMatch = city === "" || e.city === city;
        const priceMatch = (e.price >= minPrice) && (e.price <= maxPrice);
        const startDateMatch = startDate == "" || new Date(startDate) <= concertDate;
        const endDateMatch = endDate === "" || concertDate <= new Date(endDate);
        return cityMatch && priceMatch && startDateMatch && endDateMatch;
    })
    deploy(false, "card-template", "card-row", filtered_concerts)
}

function clearFilters() {
    deploy(false, "card-template", "card-row", concerts.filter(e => !e.recommended))    
}

function searchByName() {
    const searchBar = document.getElementById("search-input"); 
    const searchQuery = searchBar.value;
    console.log(searchQuery);
    const filteredResults = concerts.filter(e => {
        const lowerCase = searchQuery.toLowerCase();
        return e.artist.toLowerCase().includes(lowerCase);
    })

    deploy(false, "card-template", "card-row", filteredResults);
}

deploy(true, "carousel-template", "carousel-data", concerts.filter(e => e.recommended))
deploy(false, "card-template", "card-row", concerts.filter(e => !e.recommended))