// TODO: add browserify or webpack to build pipeline, and break this into separate js files with imports,
// instead of just using section headers




////////////////// State Fields //////////////////////

// TODO: put these in redux

var numQuantiles = 10
var fields = {
  'sba_per_small_bus': {
    userReadableName: 'Total SBA Loans per Small Business'
  },
  'loan_504_per_small_bus': {
    userReadableName: '504 Loans per Small Biz'
  },
  'loan_7a_per_small_bus': {
    userReadableName: '7a Loans per Small Biz'
  },
  'mean_agi': {
    userReadableName: 'Mean AGI'
  },
  'total_7a': {
    userReadableName: 'Total 7a Loans'
  },
  'total_504': {
    userReadableName: 'Total 504 Loans'
  },
  'total_sba': {
    userReadableName: 'Total SBA Loans'
  },
  'total_small_bus': {
    userReadableName: 'Total Small Businesses'
  }
}
var map; // instance of google.maps.Map
var sbaData;  // map from region code (eg zipcode) to region data
var colorField = 'sba_per_small_bus'
var filterField = 'sba_per_small_bus'
var colorQuantiler
var filterRange = [0, 1]







////////////////// Initialization //////////////////////




/** main entry point for the initialization; should be called by google maps API once its JS is loaded */
function initMap() {

  // load the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: -123},
    zoom: 7,
    styles: [{
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'road.highway',
        'stylers': [{'visibility': 'simplified'}]
      }, {
        'featureType': 'administrative',
        'stylers': [{'visibility': 'on'}]
      }, {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'simplified'}]
      }
    ]
  });


  // set up the style rules and events for google.maps.Data
  map.data.setStyle(styleFeature);
  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);

  // state polygons only need to be loaded once, do them now
  loadMapData();

  initControls();
}



/**
 * Loads the region boundary polygons from a GeoJSON source, and the SBA loan data, and performs the initial render
 */
function loadMapData() {

  // fire off 2 ajax requests: one for the region GeoJSON data, and one for the SBA loan data
  let regionGeometryPromise = $.ajax({
    url: window.topoUrl,
    dataType: 'json'
  })
  let sbaDataPromise = $.ajax({
    url: window.regionsUrl,
    dataType: 'json'
  })

  // once both requests have returned...
  $.when(sbaDataPromise, regionGeometryPromise).done((sbaDataResponse, regionGeometryResponse) => {
    map.data.addGeoJson(regionGeometryResponse[0], { idPropertyName: 'GEOID10' })
    sbaArray = sbaDataResponse[0].data

    // convert the SBA data from an array of regions to a map from region code (eg zip) to region data, for easy
    // lookup by region code
    sbaData = {}
    sbaArray.forEach(sbaDatum => {
      sbaData[sbaDatum.region] = sbaDatum
    })

    // go through the SBA data, cleaning up some values and calculating min/max for each field
    Object.keys(fields).forEach(field => {
      let min = Number.MAX_VALUE
      let max = Number.MIN_VALUE
      Object.values(sbaData).forEach(region => {

        // HACK: API currently returns string values for fields that are numeric in the PG DB;
        // convert them to numbers now, but ideally the API would return numbers not strings
        region[field] = parseFloat(region[field])

        if(region[field] != null && !isNaN(region[field])) {
          min = Math.min(min, region[field])
          max = Math.max(max, region[field])
        }
      })
      if(fields[field].extent === undefined) {
        fields[field].extent = [min, max]
      }
    })

    renderRegions()
  })

  // TODO error handling if either request failed
}


/** builds the color/filter controls in the DOM */
function initControls() {
  let colorSelectBox = $('#color-select');
  let filterSelectBox = $('#filter-select')
  let orderedFields = Object.keys(fields)
  orderedFields.sort((a, b) => fields[a].userReadableName < fields[b].userReadableName)
  orderedFields.forEach(key => {
    // TODO reduce duplication here, could be a React class instead
    colorSelectBox.append($('<option>', {
      text: fields[key].userReadableName,
      value: key,
      selected: key == colorField
    }))
    filterSelectBox.append($('<option>', {
      text: fields[key].userReadableName,
      value: key,
      selected: key == filterField
    }))
  })
  colorSelectBox.change(() => {
    colorField = colorSelectBox.find(':selected').prop('value')
    renderRegions();
  });
  filterSelectBox.change(() => {
    filterField = filterSelectBox.find(':selected').prop('value')
    filterRange = fields[filterField].extent.slice()
    $('#filter-slider').slider({
      min: filterRange[0],
      max: filterRange[1],
      step: (filterRange[1] - filterRange[0]) / 100,
      values: filterRange.slice()
    })
    renderRegions();
  });

  $('#filter-slider').slider({
    range: true,
    min: filterRange[0],
    max: filterRange[1],
    values: filterRange.slice(),
    slide(event, ui) {
      filterRange = ui.values.slice()
      $('#filter-min').text(round(filterRange[0], 1))
      $('#filter-max').text(round(filterRange[1], 1))
      renderRegions()
    },
    step: 0.1
  })
}





////////////////// Rendering //////////////////////




/**
 * Updates the styling on map regions to match the currently selected
 * color and filter fields
 */
function renderRegions() {
  clearRegions()

  colorQuantiler = new Quantiler(
    Object.values(sbaData).map(region => region[colorField]),
    numQuantiles)
  



  Object.values(sbaData).forEach(function(row) {
    const colorVariable = row[colorField]
    const filterVariable = row[filterField]

    if(filterRange[0] <= filterVariable && filterVariable <= filterRange[1]) {
      // update the existing row with the new data
      const feature = map.data.getFeatureById(row.region)
      if(feature)
        feature.setProperty('colorVariable', colorVariable);    
    }

  });

  $('#legend-min').text(round(fields[colorField].extent[0], 1))
  $('#legend-max').text(round(fields[colorField].extent[1], 1))
}

/** Removes census data from each shape on the map and resets the UI. */
function clearRegions() {
  map.data.forEach(function(row) {
    row.setProperty('colorVariable', undefined);
  });
}

/**
 * Applies a gradient style based on the colorField.
 * This is the callback passed to data.setStyle() and is called for each row in
 * the data set.  Check out the docs for Data.StylingFunction.
 *
 * @param {google.maps.Data.Feature} feature
 */
function styleFeature(feature) {

  // TODO: don't use a red/green color scheme!  use viridis instead?

  var low = [5, 69, 54];  // color of smallest datum
  var high = [151, 83, 34];   // color of largest datum

  // delta represents where the value sits between the min and max
  let quantile = colorQuantiler.getQuantile(feature.getProperty('colorVariable'))

  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * quantile / (numQuantiles - 1) + low[i];
  }

  // determine whether to show this shape or not
  var showRow = true;
  if (feature.getProperty('colorVariable') == null ||
      isNaN(feature.getProperty('colorVariable'))) {
    showRow = false;
  }

  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
    fillOpacity: 0.75,
    visible: showRow
  };
}

/**
 * Responds to the mouse-in event on a region
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');

  sbaDatum = sbaData[e.feature.getId()]

  $('#tooltip').html('<table>' +
      '<tr><td>Zipcode:</td><td>' + sbaDatum.region + '</td></tr>' +
      '<tr><td>SBA to Small Ratio:</td><td>' + sbaDatum.sba_per_small_bus + '</td></tr>' +
      '</table>'
      )
    // TODO is it safe to reference event coords with e.va?  it works, but is not in Google Maps API docs....
    .css({
      left: (e.va.clientX + 10) + "px",
      top: (e.va.clientY + 20) + "px"
    })
    .stop()
    .animate({
      opacity: .95
    }, 200)
}

/**
 * Responds to the mouse-out event on a region.
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
  $('#tooltip').stop().animate({opacity: 0}, 500);
}





////////////////// Utilities //////////////////////



/**
 * Constructs a set of quantile thresholds for an array of data.  Immutable.
 * Meant to be used by creating a Quantiler from the data, then 
 */
class Quantiler {

  /**
   * @param {number[]} values
   * @param {number} numQuantiles
   */
  constructor(values, numQuantiles=10) {
    values = values.filter(value => value != null && !isNaN(value))
    values.sort((a, b) => a - b)

    // note that this.thresholds will contain (numQuantiles-1) entries, representing
    // the boundary values between each of the quantiles
    this.thresholds = []
    for(let i = 1; i < numQuantiles; i++) {
      let index = i * values.length / numQuantiles
      this.thresholds[i-1] = (values[Math.floor(index)] + values[Math.ceil(index)]) / 2
    }
  }

  /**
   * @param {number} value
   * @returns {number} the 0-based quantile that contains the given value.  Will be an integer
   * in [0, numQuantiles-1] inclusive.  If the given value is below the lowest quantile or 
   * above the highest quantile, will simply return 0 or numQuantiles-1, respectively.  Returns
   * undefined if value is NaN.
   */
  getQuantile(value) {
    if(value != null && !isNaN(value)) {
      let index = this.thresholds.findIndex(threshold => value < threshold)
      if(index === -1) {
        index = this.thresholds.length
      }
      return index
    }
  }
}

/**
 * Rounds a number to a given decimal precision
 * @param {number} number
 * @param {number=} precision
 * @returns {number}
 */
function round(number, precision=0) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}