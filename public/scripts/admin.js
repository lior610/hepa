$(document).ready(function() {
    // Load content for Page 2 when clicked
    $('#load-orders').on('click', function(event) {
        event.preventDefault();

        $('#main-content').load('./admin/manage_orders.html', function() {
            
            $.getScript('./scripts/admin_manage_orders.js', function() {
                console.log("Orders JS loaded and executed.");
            });
        });
    });

    // Load content for Concerts when clicked
    $('#load-concerts').on('click', function(event) {
        event.preventDefault();

        $('#main-content').load('./admin/manage_concerts.html', function() {
            
            $.getScript('./scripts/admin_manage_concerts.js', function() {
                console.log("Concerts JS loaded and executed.");
                // Call the validation setup function after JS is loaded
                setupValidation();  // Call the validation setup here
            });
        });
    });

    // Load content for Places when clicked
    $('#load-places').on('click', function(event) {
        event.preventDefault();    

        $('#main-content').load('./admin/manage_places.html', function() {
            
            $.getScript('./scripts/admin_manage_places.js', function() {
                console.log("Places JS loaded and executed.");
                // Call the validation setup function after JS is loaded
                setupValidation();
            });
        });
    });

    // Load content for Users when clicked
    $('#load-users').on('click', function(event) {
        event.preventDefault();     // Prevent the default action of the link

        $('#main-content').load('./admin/manage_users.html', function() {
            $.getScript('./scripts/admin_manage_users.js', function() {
                console.log("Users JS loaded and executed.");
                $.getScript('./scripts/register.js', function() {
                    console.log("Register JS loaded and executed.");
                    $.getScript('./scripts/password.js', function() {
                        console.log("Password JS loaded and executed.");
                    });
                });
            });
        });
    });
});
