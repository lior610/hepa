
// jQuery ready function to make sure the DOM is fully loaded
$(document).ready(function() {

   // Load content for Page 2 when clicked
   $('#load-orders').on('click', function(event) {
    event.preventDefault();     // Prevent the default action of the link
    // load the html
    $('#main-content').load('./admin/manage_orders.html'); // Load content into the main content area
    // load its related js
    $.getScript('./scripts/admin_manage_orders.js', function() {
    console.log("orders JS loaded and executed.");})
    });

    // Load content for Page 2 when clicked
    $('#load-concerts').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_concerts.html'); // Load content into the main content area
        // load its related js
        $.getScript('./scripts/admin_manage_concerts.js', function() {
        console.log("Concerts JS loaded and executed.");})
    });

    // Load content for Page 3 when clicked
    $('#load-places').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_places.html'); // Load content into the main content area
        // load its related js
        $.getScript('./scripts/admin_manage_places.js', function() {
        console.log("places JS loaded and executed.");})
    });

    // Load content for Page 2 when clicked
    $('#load-users').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_users.html'); // Load content into the main content area
        // load its related js
        $.getScript('./scripts/admin_manage_users.js', function() {
        console.log("users JS loaded and executed.");})
    });
})
