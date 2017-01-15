var lib = require('../www/lfl.json');

console.log("delete from libraries;");
console.log("delete from images;");


lib.forEach(function(l) {
    var verified = (l.verified) ? 1 : 0;
    console.log("insert into libraries ('address', 'lat', 'lng', 'verified') values(\"" + l.address + "\"," +
        l.coordinates[0] + ',' + l.coordinates[1] + ',' +
        verified + ');');

    if (l.image) {
        console.log('insert into images ("file_name", "library_id") values("' + l.image + '", (select id from libraries where address = "' + l.address + '"));');
     }
});

