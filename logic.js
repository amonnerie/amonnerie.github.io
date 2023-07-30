/* Javascript for project 3 */
//constant/static values
const data_json = "Shark_AttacksDB.Events.json";
const geo_json = "Project3.cleanLocationDB.json";
const dropdowns = document.querySelectorAll('select');
const activityBins = ["Swimming", "Fishing", "Surfing", "Playing", "Floating", "Kayaking","Shark"];
const typeBins = ["Unprovoked", "Provoked"];
//const ctx = document.getElementById('visual2').getContext('2d');

//constant variables for map1//
const marker_id = "1";
var mapMarkers = [];
const map = L.map("visual1", {
  center: [40.752895, -101.010851],
  zoom: 4

});

//*map with color
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
//**************************//

//create event listener in order to get 
//all values from dropdowns
dropdowns.forEach(dropdown => {
  dropdown.addEventListener('change', () => {
    const values = getValues();
    console.log("current values:", values);

    //making maps and graphs here upon updates
    map1(values);
    graph1(values);
    graph2(values);
  });
});

//the init function
function init() {

  const values = getValues();
  console.log("current values:", values);
  map1(values);
  graph1(values);
  graph2(values);
};


//***helpful functions
function removeDepulicates(array) {
  let output = Array.from(new Set(array))
  return output
}

function getValues() {
  var dropdownValues = {};

  dropdowns.forEach(dropdown => {
    //get the id of each dropdown (ex: "selyear")
    const dropdownId = dropdown.id;

    //get value of each dropdown
    const selectedValue = dropdown.value;

    //create dict
    dropdownValues[dropdownId] = selectedValue;
  });

  return dropdownValues;
};

function map1(values) {

  d3.json(geo_json).then((data) => {

    let filteredData = filterData(values, data);

    if (mapMarkers.length > 0) {
      for(var i = 0; i < mapMarkers.length; i++){
        map.removeLayer(mapMarkers[i]);
      }
    };

    filteredData.forEach(feature => {
    
    var sharkIcon = L.icon({
      iconUrl: 'https://static.thenounproject.com/png/1220701-200.png',
  
      iconSize:     [35, 35], // size of the icon
      iconAnchor:   [22, 34], // point of the icon which will correspond to marker's location
      popupAnchor:  [-1, -20] // point from which the popup should open relative to the iconAnchor
  });
    var marker = L.marker([feature.Lat, feature.Lng],
    {icon: sharkIcon}).addTo(map);
    this.mapMarkers.push(marker);

    marker.bindPopup(`<b>Date:</b> ${feature.Date}
      <br><b>Location:</b> ${feature.Location}
      <br><b>Country:</b> ${feature.Country}
      <br><b>Type of Attack:</b> ${feature.Type}
      <br><b>Activity When Attacked:</b> ${feature.Activity}
      <br><b>Injury:</b> ${feature.Injury}
      <br><b>Fatal:</b> ${feature.Fatal}
      <br><b>More Info:</b> <a href=${feature.Link} target="_blank">PDF</a>
      <br>`);
});

  if(filteredData.length == 0) {
    alert("No known data with current parameters");
  }
  });
  };

function graph1(values) {

  d3.json(geo_json).then((data) => {
  let filteredData = filterData(values, data);
  let dates = [];
  for (i=0; i < filteredData.length; i++) {
    dates.push(filteredData[i].Date);
  };
  dates.sort();

  var trace = {
    x: dates,
    type: 'histogram',
  };
  var layout = {
    title: {
      text:'Frequency of Attacks by Date',
      y: 0.95
    },
    xaxis: {
      title: {
        text: 'Date of Attack',
        y: 1
      },
    },
    yaxis: {
      title: {
        text: 'Frequency',
      },
      tickmode: "array",
      tickvals: [0, 1, 2, 3, 4],
    },
    margin: {
      t: 30,
      b: 100
    },
    pad: {
      b: 20
    },
  };

  var dataTrace = [trace];
  Plotly.newPlot('visual3', dataTrace, layout);
  });
}

function graph2(values) {
  d3.json(geo_json).then((data) => {
    let filteredData = filterData(values, data);

    var tableSpot = $("#visual2")
    
    if ($.fn.dataTable.isDataTable('#visual2')) {
      tableSpot.DataTable().destroy();
    };

    tableSpot.DataTable ({
      "data" : filteredData,
      "columns" :  [
        {
            "data": "Date",
            "title": "Date",
            "defaultContent": "<i>NA</i>"
        },
        {
          "data": "Location",
          "title": "Location",
          "defaultContent": "<i>NA</i>"
        },
        {
          "data": "Type",
          "title": "Type of Attack",
          "defaultContent": "<i>NA</i>"
        },
        {
          "data": "Activity",
          "title": "Activity",
          "defaultContent": "<i>Unknown</i>"
        }],
      scrollResize: true,
      scrollY: 100,
      scrollCollapse: true,
      paging: false,
      searching: false
      
  });
  });
};

function filterData(values, data) {
  let newData = data;
  
  if(values["selyear"] != "All") {
    newData = data.filter(filterYear);
  }
  if(values["selcountry"] != "All") {
    newData = newData.filter(filterCountry);
  }
  if(values["seltype"] != "All") {
    newData = gatherType(values, newData);
  }
  if(values["selact"] != "All") {
    newData = gatherAct(values, newData);
  }
  if(values["selfatal"] != "All") {
    newData = newData.filter(filterFatal);
  }

  return newData
};

function filterYear(events) {
  values = getValues();
  return events.Year == values["selyear"];
};

function filterCountry(events) {
  values = getValues();
  return events.Country == values["selcountry"];
};

function filterFatal(events){
  values = getValues();
  return events.Fatal == values["selfatal"];
};

function gatherType(values, data){
  selType = values["seltype"];
  let filteredType = [];

  for(i=0; i<data.length; i++){
    type = data[i].Type;

    if(selType === "Other"){
      
      for (let j = 0; j < typeBins.length; j++){
        if (type.includes(typeBins[j])){
          break;
        } else if (j = 1) {
          filteredType.push(data[i]);
        } else {
          break;
        };
      };
    } else {
      if(type.includes(selType)) {
        filteredType.push(data[i]);
      };
    };
  };
  return filteredType;
};


function gatherAct(values, data) {
  const selAct = values["selact"].replace(" Related Activites", "");
  let filteredAct = [];
  
  for (let i = 0; i < data.length; i++){
    eventact = data[i].Activity;
    
    if(selAct === "Unknown") {
      //find the activities that are undefined
      if(eventact === undefined){
        filteredAct.push(data[i]);
      }
      } else if (selAct != "Other") {
      //find activites by selact
        if(eventact === undefined){
        } else {
          if(eventact.includes(selAct.toLowerCase()) || eventact.includes(selAct)){
            filteredAct.push(data[i]);
          }
        }
        
      } else {
        //selAct is "Other"
        for (let j = 0; j < activityBins.length; j++){
          if(eventact === undefined || eventact === null){
            break;
            //leave this for loop to get new eventact
          } else if (eventact.includes(activityBins[j].toLowerCase()) || eventact.includes(activityBins[j])){
            break;
            //leave this for loop to get new eventact
          } else if (j == activityBins.length-1) {
            filteredAct.push(data[i]);
          };
        };
      };

    };
//return the filtered Data
return filteredAct;
};
init();