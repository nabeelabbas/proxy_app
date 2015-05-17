'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Proxies = new Module('proxies');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Proxies.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Proxies.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Proxies.menus.add({
    title: 'Proxy',
    link: 'all proxies',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Proxies.aggregateAsset('css', 'proxies.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Proxies.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Proxies.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Proxies.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Proxies;
});
