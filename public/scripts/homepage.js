// Initialize variables
let currentConcertIndex = 0;
let concertsPerLoad = 8;
let allConcerts = []; // Store all concerts for loading
let closestConcerts = [];

// Show/Hide 'Load More' button
function showLoadMoreButton() {
    $('#load-more').show();
}

function hideLoadMoreButton() {
    $('#load-more').hide();
}

// Load more concerts
function loadMoreConcerts() {
    concertsPerLoad += 8;
    cards(currentConcertIndex, concertsPerLoad);
    if (concertsPerLoad >= allConcerts.length) {
        hideLoadMoreButton();
    } else {
        showLoadMoreButton();
    }
}

function loadClosestConcerts(concerts) {
    console.log(concerts);
    concerts.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    // concerts = concerts.slice(0, 3); 

    return concerts;
}

// Load and show closest concerts in carousel
function fetchConcerts() {
    const url = '/api_concerts/future';

    return $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            allConcerts = data;
            allConcerts.sort((a, b) => new Date(a.date) - new Date(b.date)); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error fetching concerts:", textStatus, errorThrown);
            return [];
        }
    });
}


// Assuming you have a buyConcert function defined
function buyConcert(concertId) {
    // Redirect the user to showConcert.html with the concert ID as a URL parameter
    window.location.href = `showConcert.html?id=${concertId}`;
}

function deploy(carousel, templateId, parentId, filterdConcerts) {
    if (!carousel) {
        $("#" + parentId).empty(); // Clears the parent element
    }

    // Get the template from the current document
    let template = $("#" + templateId).html();

    filterdConcerts.forEach(concert => {
        let concertTemplate = template;
        
        // Loop through concert data and replace the placeholders
        for (const key in concert) {
            let data = "";
            if (typeof(concert[key]) === "object") {
                for (const innerKey in concert[key]) {
                    data += concert[key][innerKey] + ", ";
                }
            } else {
                data = concert[key];
            }
            concertTemplate = concertTemplate.replace("{" + key + "}", data);
        }

        // Append the populated template to the parent element
        $("#" + parentId).append(concertTemplate);
    });

    if (carousel) {
        $(".carousel-item").first().addClass("active");
    }
}

function applyFilters() {
    const location = $('#location').val();
    const minPrice = parseFloat($('#minPrice').val()) || 0;
    const maxPrice = parseFloat($('#maxPrice').val()) || Infinity;
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    let filtered_concerts = allConcerts.filter(e => {
        const concertDate = new Date(e.date);
        const locationMatch = location === "" || e.location === location;
        const priceMatch = (e.price >= minPrice) && (e.price <= maxPrice);
        const startDateMatch = startDate == "" || new Date(startDate) <= concertDate;
        const endDateMatch = endDate === "" || concertDate <= new Date(endDate);
        return locationMatch && priceMatch && startDateMatch && endDateMatch;
    })
    deploy(false, "card-template", "card-row", filtered_concerts)
    hideLoadMoreButton()
}

function clearFilters() {
    cards(currentConcertIndex, concertsPerLoad)
    console.log(concertsPerLoad)
    if (concertsPerLoad <= allConcerts.length) {
        showLoadMoreButton()
    }
}

function searchByName() {
    const searchQuery = $('#search-input').val();
    console.log(searchQuery);
    const filteredResults = allConcerts.filter(e => {
        const lowerCase = searchQuery.toLowerCase();
        return e.artist_name.toLowerCase().includes(lowerCase);
    })
    hideLoadMoreButton()
    deploy(false, "card-template", "card-row", filteredResults);
}

function cards(start, end) {
    deploy(false, "card-template", "card-row", allConcerts.slice(start, end));
}

fetchConcerts().then(() => {
    cards(currentConcertIndex, concertsPerLoad)
    deploy(true, "carousel-template", "carousel-data", allConcerts.slice(0, 3));
});

const today = new Date().toISOString().split('T')[0];
const $startDate = $('#startDate');
$startDate.attr('min', today);
const $endDate = $('#endDate');
$startDate.on('change', function() {
    const selectedStartDate = $startDate.val();
    $endDate.attr('min', selectedStartDate);
});