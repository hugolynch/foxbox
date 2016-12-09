var lib = require('../data/lfl.json');


lib.forEach(function(l) {
    console.log('{"address":"' + l.library.Street__c + 
            '", "lfl_no":' + l.library.Official_Charter_Number__c + ', "coordinates": [' + l.library.Library_Geolocation__c.latitude + ',' + l.library.Library_Geolocation__c.longitude + ']},');
});

