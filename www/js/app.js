(function() {




var feature;

var tile_url = 'https://api.mapbox.com/styles/v1/hugolynch/ciw1168ie003k2kr33r5p963z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVnb2x5bmNoIiwiYSI6ImNpdzEwbHc1YTA5Mm8yb3BiOHR5eHB5YWIifQ.9Gkbywr6-VD6cEJrUneNBA';

var zoom = {
    "min": 11,
    "max": 18,
    "default": 13
};


var appmap = L.map('mapid', {zoomControl: false})
    .setView([43.671775, -79.334912], zoom.default);

appmap.setMaxBounds([
    [43.89146, -79.69002],
    [43.54407, -79.06242]
]);

/* Set the base layer */
L.tileLayer(tile_url, {
    attribution: '',
    minZoom: zoom.min,
    maxZoom: zoom.max
}).addTo(appmap);


/* custom icons */
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

/* Popup templates */
function createLflTooltip(image) {
        var tooltipTemplate =  '{address}';
        if (image) {
            tooltipTemplate += '<br/><img width="150px" src="images/{image}"/>';
        } else {
            tooltipTemplate += '<div class="placeholder">';
            tooltipTemplate += '<img width="150px" src="assets/placeholder.png"/>';
            tooltipTemplate += '<div class="placeholder-add">';
            tooltipTemplate += '<a href="#" class="show-form">';
            tooltipTemplate += '<img src="assets/placeholder-icon.png"/>';
            tooltipTemplate += '</a></div>';
            tooltipTemplate += '</div>';

            tooltipTemplate += '<form style="visibility:hidden" class="photo-add" action="api/index.php" method="post" enctype="multipart/form-data">';
            tooltipTemplate += '<input type="hidden" name="action" value="photo"/>';
            tooltipTemplate += '<input type="hidden" name="address" value="{address}"/>';
            tooltipTemplate += '<input type="file" style="width:100%" required accept="image/*" name="photo"/>';
            tooltipTemplate += '<div class="message"></div>';
            tooltipTemplate += '<button class="save" style="display:none" type="submit">Save</button>';
            tooltipTemplate += '</form>';
        }
    return tooltipTemplate;
}

function createTplTooltip(image) {
    var tooltipTemplate =  '<strong>Toronto Public Library</strong><br/>';
    tooltipTemplate +=  '<strong><a href="{url}">{name} Branch</a></strong>';
    tooltipTemplate +=  '<br/>{address}';
    if (image) {
        tooltipTemplate += '<br/><img width="150px" src="images/{image}"/>';
    }
    return tooltipTemplate;
}


var layers = [
    {
        'id': 'lfl',
        'name': 'Library Boxes'
    },
    {
        'id': 'tpl',
        'name':  'Public Libraries'
    }
];

var overlays = {};
var overlays_v = {};

var fb;
$.getJSON('admin/api/libraries', function(data) {
        fb = data;
});


layers.forEach(function(layer) {
    $("#layers-menu-ui").hide();
    $("#layers-menu-ui").append('<a href="#" class="active" data-filter="' + layer.id + '">' + layer.name + '</li>');
});



layers.forEach(function(layer) {
    layer.data = L.layerGroup();
    
    $.getJSON(layer.id + '.json', function(data) {

        data.forEach(function(library) {

            /* If we have a name, it is a Toronto Public Library */            
            if (library.name) {
                icon = tplIcon;
                tooltipTemplate = createTplTooltip(library.image);
            }
            else {
                tooltipTemplate = createLflTooltip(library.image);
                if (library.verified) {
                    icon = verifiedIcon;
                } else {
                    icon = myIcon;
                }
            }
            var tooltipData = {  
                name: library.name,
                address: library.address,
                url: library.url,
                image: library.image
            };
            var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

            L.marker(library.coordinates, {icon: icon, title: library.address})
            .addTo(layer.data)
            .bindPopup(tooltipContent);
        });
    });

    overlays[layer.id] = layer.data.addTo(appmap);
    overlays_v[layer.id] = true;

});


/* Add controls */
//L.control.layers(null, overlays, {position: 'bottomright'}).addTo(appmap);


var gc = L.control.locate({position: 'topright'}).addTo(appmap);
var lc = L.control.layers(null, overlays, {position: 'bottomright'}).addTo(appmap);

//var gc= L.control.locate();
var geolocate = false;


$("#add").on('click', function(e) {
    e.stopPropagation();
    alert("Not working yet. To add a library box, type the address in the search bar.");

});

$("#layers").on('click', function(e) {
    e.stopPropagation();
    $('#layers-menu-ui').toggle();
});

$('#layers-menu-ui a').on('click', function(e) {
    e.stopPropagation();

    $(this).addClass('active');    
    var filter = $(this).data('filter');

    if (overlays_v[filter] == true) {
        overlays_v[filter] = false;
        $(this).removeClass('active');    
        overlays[filter].remove();
    } else {
        overlays[filter].addTo(appmap);
        overlays_v[filter] = true;
        $(this).addClass('active');    
    }
});


$("#location").on('click', function(e) {

    e.stopPropagation();

    var button = $(this);

    if (geolocate) {
        gc.stop();
        geolocate = false;
        button.removeClass('active');
    } else {
        geolocate = true;
        gc.start();
        button.addClass('active');
    }
    console.log("locate");

});

function onPopupOpen() {

    var tempMarker = this;

    $(".add-button").on('click', function () {
        var address = $(this).data('address');
        
        //var url = $(this).attr('action');
        var url = 'api/index.php';

        $.ajax({
            method: "POST",
            url: url,
            data: {
                action: 'store',
                address: address,
                lat: tempMarker._latlng.lat,
                lon: tempMarker._latlng.lng
            }
        })
        .done(function( msg ) {
            tooltipTemplate = createLflTooltip();
            var tooltipData = {  
                address: address,
            };
            var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

            appmap.removeLayer(tempMarker);
            L.marker(tempMarker._latlng, {icon: myIcon})
            .addTo(appmap)
            .bindPopup(tooltipContent)
            .openPopup();
        });

    });

    
}


$("#search").on('submit', addr_search);

function addr_search(e) {
    var search_suffix = ', Toronto';
    var search_url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=';
    e.preventDefault();

    var inp = document.getElementById("address");
    //var address = inp.value + search_suffix;
    var address = inp.value + search_suffix;


    /* Check if we have this address in our database */
    /*
    for (i in fb) {
        if (fb[i].address == address) {
            console.log(fb[i]);
            return fb[i].address;
        }
    }
    */

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


        if (feature) {
            appmap.removeLayer(feature);
        }
        feature = L.marker(location, {icon: featureIcon}).addTo(appmap)
            .bindPopup('Address: ' + new_address + '<br/>Location: ' + location + "<br/><button data-address='" + new_address + "' class='add-button'>Add to map</button>");
        appmap.fitBounds(bounds);
        appmap.setZoom(18);
        feature.on("popupopen", onPopupOpen);
    });
}


    $("#mapid").on('click', '.show-form', function (e) {
        e.preventDefault();

        //FIXME: use popup.update() w/display:none to resize popup box.

        $(".photo-add").css('visibility', 'visible');
    });



appmap.on('popupopen', function(e) {
    var tempMarker = this;

    /* Validate image file */
    $("#mapid").off('change').on('change', 'input:file', function (e) {
        var file = this.files[0];

        var max_size = 10 * 1024 * 1024; // MB
        if (file.size > max_size) {
            var message = "<p>The file is too big (" + formatBytes(file.size) + ").";
            message += "<br/>The maximum size is " + formatBytes(max_size) + ".";
            $(".message").html(message);
        }
        else if(file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/gif' && file.type != 'image/jpeg' ) {
            $(".message").html("Invalid image file.");
        } else {
            $(".save").show();
            
        }
    });


    /* Upload image and update database. */
    $("#mapid").off('submit').on('submit', '.photo-add', function (e) {
        e.preventDefault();

        data = new FormData( this );
        var url = $(this).attr('action');

        $.ajax({
            url: url,
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false
        })
        .done(function(msg) {
            tooltipTemplate = createLflTooltip(msg.image);

            var tooltipData = {  
                address: msg.address,
                image: msg.image
            };
            var tooltipContent = L.Util.template(tooltipTemplate, tooltipData); 

            tempMarker._popup.setContent(tooltipContent);
        });

    });

});


appmap.on('zoomend', function(event) {
    document.body.className = "zoom"+appmap.getZoom();
});


function formatBytes(bytes, decimals) {
   if (bytes == 0) {
        return '0 Bytes';
    }

    var k = 1024;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


}());
