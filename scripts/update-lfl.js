var lib = require('../data/lfl.json');


lib.forEach(function(l) {
    if (l.library.Street__c) {
    console.log("update libraries set lfl_no = " + l.library.Official_Charter_Number__c + " where address like '" + l.library.Street__c.substring(0, 8) + "%';");
}
});


