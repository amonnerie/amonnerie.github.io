//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const api_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//create all the graphs with the initial id=940
function init() {
    id = "940";
    optionChanged(id)
}

//change #selDataset with dropdown()
d3.selectAll("#selDataset").on("change", dropdown);

//create the dropdown menu
function dropdown() {
    let dropdownMenu = d3.select("#selDataset");
    
    d3.json(api_url).then((data) => {
    let sampleNames = data.names;

    for (let i = 0; i < sampleNames.length; i++){
      dropdownMenu
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };
  });
}

//updates the graphs with a new id after the changed from the dropdown menu
function optionChanged(id) {
    //console.log("in change function:", id);
     new_bar(id);
     new_bub(id);
     new_info(id);
};

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.
function new_bar(id) {
    d3.json(api_url).then(function(json_data) {
      
        let samples = json_data.samples.find(sample => sample.id === id);
      
        let data = [{
            x: samples.sample_values.slice(0, 10).reverse(),
            y: samples.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
            text: samples.otu_labels.slice(0, 10).reverse(),
            orientation: 'h',
            type: "bar"
        }];
    
        let layout = {
            height: 800,
            width: 600
        };
    
        Plotly.newPlot("bar", data, layout);

      });
};

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.
function new_bub(id) {
    d3.json(api_url).then(function(json_data) {
      
        let samples = json_data.samples.find(sample => sample.id === id);
      
        let data = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: 'markers',
            marker: {
              size: samples.sample_values,
              color: samples.otu_ids,
              colorscale: 'Earth' // Choose a colorscale for the marker colors
            },
            text: samples.otu_labels
          }];
    
        let layout = {
            height: Math.max(...samples.sample_values)+500,
            width: Math.max(...samples.sample_values)+1000
        };
    
        Plotly.newPlot("bubble", data, layout);

      });
};


//Display the sample metadata, i.e., an individual's demographic information.
//Display each key-value pair from the metadata JSON object somewhere on the page.
function new_info(id) {
    let info_panel = d3.select("#sample-metadata");
    info_panel.html("");
    
    d3.json(api_url).then(function(json_data) {
        
        let sample_data = json_data.metadata.find(meta => meta.id === parseInt(id));
        
        for (let key in sample_data) {
            info_panel
              .append("p")
              .text(`${key}: ${sample_data[key]}`);
          }

    });
};

//call the init() to create the initial visuals and info 
//and create the dropdown menu upon opening the site
dropdown();
init();