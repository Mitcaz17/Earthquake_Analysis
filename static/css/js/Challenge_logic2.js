// console.log("working");

// let map = L.map('mapid').setView([40.7, -94.5], 4);


let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let baseMaps = {
    Street: streets,
    Dark: dark,
    Satellite: satelliteStreets,
};
let map = L.map('mapid', {
    center: [30, 30],
    zoom: 2,
    layers: [streets]
});



let earthquakes = new L.layerGroup();

// D-1 2nd layer group 
let tectonicPlates = new L.layerGroup();

//  D-2 3rd layer
let majorEarthquakes = new L.LayerGroup();

let overlays = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates,
    "Major Earthquakes": majorEarthquakes,
};



L.control.layers(baseMaps, overlays).addTo(map);

// L.circleMarker([34.0522, -118.2437]).addTo(map);

// let sanFranAirport =
// {
//     "type": "FeatureCollection", "features": [{
//         "type": "Feature",
//         "properties": {
//             "id": "3469",
//             "name": "San Francisco International Airport",
//             "city": "San Francisco",
//             "country": "United States",
//             "faa": "SFO",
//             "icao": "KSFO",
//             "alt": "13",
//             "tz-offset": "-8",
//             "dst": "A",
//             "tz": "America/Los_Angeles"
//         },
//         "geometry": {
//             "type": "Point",
//             "coordinates": [-122.375, 37.61899948120117]
//         }
//     }
//     ]
// };

// L.geoJson(data, {
//     pointToLayer: function(feature, latlng) {
//       return L.marker(latlng);
//      }
// });

// L.geoJSON(sanFranAirport, {
//     pointToLayer: function(feature, latlng) {
//         return L.circleMarker(latlng)
//         .bindPopup("<h2>" + feature.properties.city + "</h2>");
//     }
// }).addTo(map);

// L.geoJSON(sanFranAirport, {
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("<h4>" + feature.properties.city + "</h4>" + "<hr>" + "<br>" + "<h6>faa code  </h6>" + feature.properties.faa);
//      }
// }).addTo(map);

let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(earthquakeData).then(function (data) {
    console.log(data);

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function getColor(magnitude) {
        if (magnitude > 5) {
            return "#ea2c2c";
        }
        if (magnitude > 4) {
            return "#ea822c";
        }
        if (magnitude > 3) {
            return "#ee9c00";
        }
        if (magnitude > 2) {
            return "#eecc00";
        }
        if (magnitude > 1) {
            return "#d4ee00";
        }
        return "#98ee00";
    }



    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }


    // Creating a GeoJSON layer with the retrieved data.
    L.geoJSON(data, {

        // We turn each feature into a circleMarker on the map.

        pointToLayer: function (feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }


    }).addTo(earthquakes);

    // ############################# D3 Code

    // 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function (majorData) {

        // 4. Use the same style as the earthquake data.
        d3.json(earthquakeData).then(function (data) {
            console.log(data);

            function styleInfo(feature) {
                return {
                    opacity: 1,
                    fillOpacity: 1,
                    fillColor: getColor(feature.properties.mag),
                    color: "#000000",
                    radius: getRadius(feature.properties.mag),
                    stroke: true,
                    weight: 0.5
                };
            }

            // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
            function getColor(magnitude) {
                if (magnitude > 6) {
                    return "#6a0dad";
                }
                if (magnitude > 5) {
                    return "#ea2c2c";
                }
                if (magnitude <= 5) {
                    return "#ea822c";
                }

            }

            // 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
            function getRadius(magnitude) {
                if (magnitude === 0) {
                    return 1;
                }
                return magnitude * 4;
            }

            // 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map 
            // sets the style of the circle, and displays the magnitude and location of the earthquake
            //  after the marker has been created and styled.
            L.geoJson(majorData, {
                pointToLayer: function (feature, latlng) {
                    console.log(data);
                    return L.circleMarker(latlng);
                },
                // We set the style for each circleMarker using our styleInfo function.
                style: styleInfo,

                onEachFeature: function (feature, layer) {
                    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
                }

            
                // 8. Add the major earthquakes layer to the map.
             }).addTo(majorEarthquakes);
            // 9. Close the braces and parentheses for the major earthquake data.

        });

        let legend = L.control({
            position: "bottomright"
        });


        legend.onAdd = function () {
            let div = L.DomUtil.create("div", "info legend");


            const magnitudes = [0, 1, 2, 3, 4, 5];
            const colors = [
                "#98ee00",
                "#d4ee00",
                "#eecc00",
                "#ee9c00",
                "#ea822c",
                "#ea2c2c"
            ];

            for (var i = 0; i < magnitudes.length; i++) {
                console.log(colors[i]);
                div.innerHTML +=
                    "<i style='background: " + colors[i] + "'></i> " +
                    magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
            }
            return div;
        };

        legend.addTo(map);

        // Link to tectonic plates

        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (tectonicData) {
            console.log(tectonicData)

            L.geoJSON(tectonicData, {
                color: "orange",
                weight: 2.5,


            }).addTo(tectonicPlates);

            tectonicPlates.addTo(map);



        });





    });

});