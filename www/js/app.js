var feature;

var mymap = L.map('mapid', {zoomControl: false}).setView([43.671775, -79.334912], 13);

mymap.setMaxBounds([
    [43.89146, -79.69002],
    [43.54407, -79.06242]
]);



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


var lfl = L.layerGroup();
var tpl = L.layerGroup();



$.getJSON('lfl.json', function(data) {
    data.forEach(function(library) {

        var tooltipTemplate =  '{address}';
        if (library.image) {
            tooltipTemplate += '<br/><img width="150px" src="images/{image}"/>';
        } else {
            tooltipTemplate += '<br/><a href="#"><img src="images/ic_add_a_photo_black_24px.svg"/>Add a photo</a>';
            tooltipTemplate += '<form action="save.php" method="post" enctype="multipart/form-data">';
            tooltipTemplate += '<input type="hidden" name="action" value="photo"/>';
            tooltipTemplate += '<input type="file" name="photo"/><input type="hidden" name="address" value="{address}"/>';
            tooltipTemplate += '<button type="submit">Save</button></form>';
        }

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

L.tileLayer('https://api.mapbox.com/styles/v1/hugolynch/ciw1168ie003k2kr33r5p963z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVnb2x5bmNoIiwiYSI6ImNpdzEwbHc1YTA5Mm8yb3BiOHR5eHB5YWIifQ.9Gkbywr6-VD6cEJrUneNBA', {
    attribution: '',
    minZoom: 11,
    maxZoom: 18,

}).addTo(mymap);



var overlays = {
    'Public Libraries': tpl,
    'Free Little Libraries': lfl
};

L.control.layers(null, overlays, {position: 'bottomright'}).addTo(mymap);

tpl.addTo(mymap);
lfl.addTo(mymap);

L.control.zoom({position: 'bottomleft'}).addTo(mymap);



function addr_search() {
    var inp = document.getElementById("addr");
    var address = inp.value + " Toronto";
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

        $('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Search results:" }).appendTo('#results');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
    });
}

function chooseAddr(lat1, lng1, lat2, lng2, osm_type) {
    var loc1 = new L.LatLng(lat1, lng1);
    var loc2 = new L.LatLng(lat2, lng2);
    var bounds = new L.LatLngBounds(loc1, loc2);

    if (feature) {
        mymap.removeLayer(feature);
    }
    if (osm_type == "node") {
        feature = L.circle( loc1, 25, {color: 'green', fill: false}).addTo(mymap);
        mymap.fitBounds(bounds);
        mymap.setZoom(18);
    } else {
        var loc3 = new L.LatLng(lat1, lng2);
        var loc4 = new L.LatLng(lat2, lng1);

        feature = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(mymap);
        mymap.fitBounds(bounds);
    }
}

/*
https://github.com/derickr/osm-tools/blob/master/leaflet-nominatim-example/js/map.js
*/


mymap.on('zoomend', function(event) {
    document.body.className = "zoom"+mymap.getZoom();
});


/*

// attaching function on map click
//http://jsfiddle.net/kedar2a/5VLJU/8/
mymap.on('click', onMapClick);
*/

/*
function onMapClick(e) {

    var geojsonFeature = {
        "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [e.latlng.lat, e.latlng.lng]
        }
    }

    var marker;

    L.geoJson(geojsonFeature, {
        
        pointToLayer: function(feature, latlng){
            
            marker = L.marker(e.latlng, {
                
                title: "Resource Location",
                alt: "Resource Location",
                riseOnHover: true,
                draggable: true,

            }).bindPopup("<input type='button' value='Delete this marker' class='marker-delete-button'/>");

            marker.on("popupopen", onPopupOpen);
       
            return marker;
        }
    }).addTo(mymap);
}

// Function to handle delete as well as other events on marker popup open
function onPopupOpen() {

    var tempMarker = this;

    //var tempMarkerGeoJSON = this.toGeoJSON();

    //var lID = tempMarker._leaflet_id; // Getting Leaflet ID of this marker

    // To remove marker on click of delete
    $(".marker-delete-button:visible").click(function () {
        mymap.removeLayer(tempMarker);
    });
}


// getting all the markers at once
function getAllMarkers() {
    
    var allMarkersObjArray = [];//new Array();
    var allMarkersGeoJsonArray = [];//new Array();

    $.each(map._layers, function (ml) {
        //console.log(map._layers)
        if (mymap._layers[ml].feature) {
            
            allMarkersObjArray.push(this)
                                    allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()))
        }
    })

    console.log(allMarkersObjArray);
    alert("total Markers : " + allMarkersGeoJsonArray.length + "\n\n" + allMarkersGeoJsonArray + "\n\n Also see your console for object view of this array" );
}

$(".get-markers").on("click", getAllMarkers);
*/

