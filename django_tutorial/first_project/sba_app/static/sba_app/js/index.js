/* page setup */
var width = parseInt(d3.select('#map_container').style('width')),
    height = width,
    active = d3.select(null)

var svg = d3.select("#map_container").append("svg")
    .style('width', width + 'px')
    .style('height', height + 'px');
    // .on("click", stopped, true)

var projection = d3.geoMercator()
    .center([-122.433701, 37.767683])
    .scale(3 * width)
    .translate([width / 2, height / 2])

var path = d3.geoPath()
    .projection(projection)


// TODO: change the color scale to use scaleQuantile (real quantiles) instead of
// scaleQuantize (linear scale between the data min and max)
var bins = rangeArray(9)
var colorScale = d3.scaleQuantize()
colorScale.range(bins)


const zipsUrl = d3.select('#map_container').attr('data-zips-url')
const topoUrl = d3.select('#map_container').attr('data-topo-url')

d3.queue()
  .defer(d3.json, zipsUrl)
  .defer(d3.json, topoUrl)
  .await(drawMap);


function drawMap(error, data, map) {
  if (error) throw error;
  if(data.status !== 'success') {
    console.log('error: ' + data.status)
    return
  }

  data = data.data

  let exten = d3.extent(data, (d)=>{return d.sba_per_small_bus})
  colorScale.domain(exten)

  let dataMap = d3.nest()
      .key(d=>{return d.borr_zip})
      .rollup(v=>{return v[0].sba_per_small_bus})
      .object(data)

  var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  svg.append('g')
      .selectAll('.zip')
        .data(topojson.feature(map, map.objects.ca_zips).features)
      .enter().append('path')
        .attr('d', path)
        .on("mouseover", function(d) {
            let sba_per_small_bus = dataMap[d.properties.GEOID10]
            tooltip.transition()        
                .duration(200)
                .style("opacity", .95);      
            tooltip .html('<table>' +
                '<tr><td>Zipcode:</td><td>' + d.properties.GEOID10 + '</td></tr>' +
                '<tr><td>SBA to Small Ratio:</td><td>' + sba_per_small_bus + '</td></tr>' +
                '<tr><td>Ratio Quantile:</td><td>' + colorScale(sba_per_small_bus) + '</td></tr>' +
                '</table>'
                )  
                .style("left", (d3.event.pageX + 10) + "px")     
                .style("top", (d3.event.pageY + 20) + "px");    
            })                  
        .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        })
        .attr('class', function(d){
          let val = dataMap[d.properties.GEOID10]
          return colorScale(val)
        })
}





function rangeArray (bins) {
  //TODO: i think there is a native d3 function that does this
  var result = [],
      max = bins - 1
  for (var i = 0; i <= max; i++) {
   result.push('q'+ i + '-' + bins);
  }
  return result
}