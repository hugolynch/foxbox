(function() {


var feature;

var tile_url = 'https://api.mapbox.com/styles/v1/hugolynch/ciw1168ie003k2kr33r5p963z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVnb2x5bmNoIiwiYSI6ImNpdzEwbHc1YTA5Mm8yb3BiOHR5eHB5YWIifQ.9Gkbywr6-VD6cEJrUneNBA';

var zoom = {
    "min": 11,
    "max": 18,
    "default": 13
};


var mymap = L.map('mapid', {zoomControl: false}).
    setView([43.671775, -79.334912], zoom.default);

mymap.setMaxBounds([
    [43.89146, -79.69002],
    [43.54407, -79.06242]
]);

/* Set the base layer */
L.tileLayer(tile_url, {
    attribution: '',
    minZoom: zoom.min,
    maxZoom: zoom.max
}).addTo(mymap);




var myIcon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [10, 4]
});

var verifiedIcon = L.divIcon({
    className: 'verified-div-icon',
    iconAnchor: [10, 4]
});

var tplIcon = L.divIcon({
    className: 'tpl-div-icon',
    iconAnchor: [10, 4]
});

var featureIcon = L.divIcon({
    className: 'feature-div-icon',
    iconAnchor: [10, 4]
});


var lfl = L.layerGroup();
var tpl = L.layerGroup();

function createTooltip(image) {
console.log(image);
        var tooltipTemplate =  '{address}';
        if (image) {
            tooltipTemplate += '<br/><img width="150px" src="images/{image}"/>';
        } else {
            tooltipTemplate += '<br/><a href="#" class="show-form"><img class="icon" src="assets/ic_add_a_photo_black_24px.svg"/>Add a photo</a>';

            tooltipTemplate += '<form style="visibility:hidden" class="photo-add" action="save.php" method="post" enctype="multipart/form-data">';
            tooltipTemplate += '<input type="hidden" name="action" value="photo"/>';
            tooltipTemplate += '<input type="hidden" name="address" value="{address}"/>';
            tooltipTemplate += '<input type="file" required name="photo"/>';
            tooltipTemplate += '<button type="submit">Save</button>';
            tooltipTemplate += '</form>';
        }
    return tooltipTemplate;
}


$.getJSON('lfl.json', function(data) {
    $(".photo-add").on('submit', function (e) {
        e.preventDefault();
        console.log('photo');
    });


    data.forEach(function(library) {

        var tooltipTemplate = createTooltip(library.image);
        var tooltipData = {  
            address: library.address,
            image: library.image
        };
        var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

        if (library.verified) {
            icon = verifiedIcon;
        } else {
            icon = myIcon;
        }

        L.marker(library.coordinates, {icon: icon})
            .addTo(lfl)
            .bindPopup(tooltipContent);
    });
});


$.getJSON('tpl.json', function(data) {
    data.forEach(function(library) {

        var tooltipTemplate =  '<strong>Toronto Public Library</strong><br/>';
        tooltipTemplate +=  '<strong><a href="{url}">{name} Branch</a></strong>';
        tooltipTemplate +=  '<br/>{address}';
        if (library.image) {
            tooltipTemplate += '<br/><img width="150px" src="images/{image}"/>';
        }

        var tooltipData = {  
            name: library.name,
            address: library.address,
            url: library.url,
            image: library.image
        };

        var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 
        icon = tplIcon;

        L.marker(library.coordinates, {icon: icon})
            .addTo(tpl)
            .bindPopup(tooltipContent);
    });
});


var overlays = {
    'Public Libraries': tpl,
    'Library Boxes': lfl
};

L.control.layers(null, overlays, {position: 'bottomright'}).addTo(mymap);

tpl.addTo(mymap);
lfl.addTo(mymap);

L.control.zoom({position: 'bottomleft'}).addTo(mymap);


function onPopupOpen() {

    var tempMarker = this;

    var tempMarkerGeoJSON = this.toGeoJSON();

    //var lID = tempMarker._leaflet_id; // Getting Leaflet ID of this marker

    $(".add-button").on('click', function () {
        var address = $(this).data('address');
        console.log('add location to db');
        console.log(address);
        console.log(tempMarker._latlng.lat);
        console.log(tempMarker._latlng.lng);

        $.ajax({
            method: "POST",
            url: 'save.php',
            data: {
                action: 'store',
                address: address,
                lat: tempMarker._latlng.lat,
                lon: tempMarker._latlng.lng
            }
        })
        .done(function( msg ) {
            tooltipTemplate = createTooltip();
            var tooltipData = {  
                address: address,
            };
            var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

            mymap.removeLayer(tempMarker);
            L.marker(tempMarker._latlng, {icon: myIcon})
            .addTo(mymap)
            .bindPopup(tooltipContent)
            .openPopup();
            
            //alert( "Data Saved: " + msg );
        });

    });

    
}


$("#search").on('submit', addr_search);

function addr_search(e) {
    var search_suffix = ', Toronto';
    var search_url = 'http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=';
    e.preventDefault();

    var inp = document.getElementById("address");
    var address = inp.value + search_suffix;
    $.getJSON(search_url + address, function(data) {

        $('#results').empty();
        if (data.length == 0) {
            $('<p>', { html: "No results." }).appendTo('#results');
            return;
        }

        var new_address = data[0].address.house_number + ' ' + data[0].address.road;
        var location = new L.LatLng(data[0].lat, data[0].lon);
        var bb = data[0].boundingbox;
            
        var loc1 = new L.LatLng(bb[0], bb[2]);
        var loc2 = new L.LatLng(bb[1], bb[3]);
        var bounds = new L.LatLngBounds(loc1, loc2);


        console.log(data[0]);

        if (feature) {
            mymap.removeLayer(feature);
        }
        feature = L.marker(location, {icon: featureIcon}).addTo(mymap)
            .bindPopup('Address: ' + new_address + '<br/>Location: ' + location + "<br/><button data-address='" + new_address + "' class='add-button'>Add to map</button>");
        mymap.fitBounds(bounds);
        mymap.setZoom(18);
        feature.on("popupopen", onPopupOpen);
    });
}


    $("#mapid").on('click', '.show-form', function (e) {
        e.preventDefault();

        //FIXME: use popup.update() w/display:none to resize popup box.

        $(".photo-add").css('visibility', 'visible');
    });



mymap.on('popupopen', function(e) {
    var tempMarker = this;


    /* Upload image and update database. */
    $("#mapid").on('submit', '.photo-add', function (e) {
        e.preventDefault();

        var url = $(this).attr('action');

        data = new FormData( this );

        $.ajax({
            url: url,
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false
        })
        .done(function(msg) {
            console.log(msg);
            console.log(msg.address);

            tooltipTemplate = createTooltip(msg.image);
            console.log('tooltip');
            console.log(tooltipTemplate);

            var tooltipData = {  
                address: msg.address,
                image: msg.image
            };
            var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

            tempMarker._popup.setContent(tooltipContent);
        });

    });

});


mymap.on('zoomend', function(event) {
    document.body.className = "zoom"+mymap.getZoom();
});



}());
