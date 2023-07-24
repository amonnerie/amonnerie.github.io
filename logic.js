const api_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//get color function
function getColor(d) {
    return d > 90 ? '#d73027' :
           d > 70  ? '#fc8d59' :
           d > 50  ? '#fee08b' :
           d > 30  ? '#d9ef8b' :
           d > 10   ? '#91cf60' :
                      '#1a9850';
};

function init() {
    d3.json(api_url).then(function(json_data) {
        let data = json_data.features;

        //console.log("data", data);

        const map = L.map('map').setView([37.954585, -116.884660], 5);


        //make the legend
        var legend = L.control({position: 'bottomright'});

        //add a tile layer, setting the style of map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //get the data on map from json
        data.forEach(feature => {
            const { geometry, properties } = feature;
            const { coordinates } = geometry;
            const [longitude, latitude, depth] = coordinates;
      
            // Extract earthquake properties for the pop up
            const { mag, place } = properties;
            
            // Customize the marker appearance based on the earthquake magnitude
            const marker = L.circleMarker([latitude, longitude], {
              radius: mag * 5,
              fillColor: getColor(depth),
              color: 'white',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.7,
            }).addTo(map);
            
            //add popup when user clicks on an event on map
            marker.bindPopup(`longitude: ${longitude}
                            <br>latitude: ${latitude}
                            <br>Location: ${place}
                            <br>Magnitude: ${mag}
                            <br>Depth ${depth}
                            <br>`);

            });

            //create the static legend
            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'legend'),
                    depths = [-10, 10, 30, 50, 70, 90],
                    labels = [];
            
                for (var i = 0; i < depths.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
                        console.log(depths[i], getColor(depths[i] + 1));
                        }
                return div;
                };
                legend.addTo(map);
});
};

init();