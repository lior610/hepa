$(document).ready(function() {
    // Load content for Page 2 when clicked
    $('#load-orders').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_orders.html', function() {
            // load its related js after html is loaded
            $.getScript('./scripts/admin_manage_orders.js', function() {
                console.log("Orders JS loaded and executed.");
            });
        });
    });

    // Load content for Concerts when clicked
    $('#load-concerts').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_concerts.html', function() {
            // load its related js after html is loaded
            $.getScript('./scripts/admin_manage_concerts.js', function() {
                console.log("Concerts JS loaded and executed.");
                // Call the validation setup function after JS is loaded
                setupValidation();  // Call the validation setup here
            });
        });
    });

    // Load content for Places when clicked
    $('#load-places').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_places.html', function() {
            // load its related js after html is loaded
            $.getScript('./scripts/admin_manage_places.js', function() {
                console.log("Places JS loaded and executed.");
            });
        });
    });

    // Load content for Users when clicked
    $('#load-users').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link
        // load the html
        $('#main-content').load('./admin/manage_users.html', function() {
            // load its related js after html is loaded
            $.getScript('./scripts/admin_manage_users.js', function() {
                console.log("Users JS loaded and executed.");
            });
        });
    });
});
