//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const api_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.
function init_bar() {
    d3.json(api_url).then(function(json_data) {
      
        //let samples = json_data.samples.map(function(sample) {
        //  return sample;
        //});

        let samples = json_data.samples;
      
        let data = [{
            x: samples[0].sample_values.slice(0, 10).reverse(),
            y: samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
            text: samples[0].otu_labels.slice(0, 10).reverse(),
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

d3.selectAll("#selDataset").on("change", getData);

function getData() {
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

function optionChanged(id) {
    //console.log("in change function:", id);
     new_bar(id);
     new_bub(id);
     new_info(id);
};

init_bar();
getData();

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.
function init_bub() {
    d3.json(api_url).then(function(json_data) {
      
        let samples = json_data.samples[0];
      
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
            height: 500,
            width: 1100
        };
    
        Plotly.newPlot("bubble", data, layout);

      });
}

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
init_bub();

//Display the sample metadata, i.e., an individual's demographic information.
function init_info() {
    
    let info_panel = d3.select("#sample-metadata");
    
    d3.json(api_url).then(function(json_data) {
      
        let metadata = json_data.metadata[0];

        console.log("metadata: ", metadata);

        for (let key in metadata) {
            info_panel
              .append("p")
              .text(`${key}: ${metadata[key]}`);
          }

      });
}

function new_info(id) {
    const api_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    let info_panel = d3.select("#sample-metadata");
    info_panel.html("");
    
    d3.json(api_url).then(function(json_data) {
        
        console.log("id ", id);
        
        let sample_data = json_data.metadata.find(meta => meta.id === parseInt(id));
        
        console.log("metadata: ", sample_data);
        
        for (let key in sample_data) {
            info_panel
              .append("p")
              .text(`${key}: ${sample_data[key]}`);
          }

    });
};

init_info();
//Display each key-value pair from the metadata JSON object somewhere on the page.



//Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:



//Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file