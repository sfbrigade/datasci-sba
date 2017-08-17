

var map;
var sbaData;
var selectedField = 'sba_per_small_bus'
var fields = {
  'sba_per_small_bus': {
    userReadableName: 'Total SBA Loans per Small Biz',
    extent: [0, 1]
  },
  'loan_504_per_small_bus': {
    userReadableName: '504 Loans per Small Biz',
    extent: [0, 1]
  },
  'loan_7a_per_small_bus': {
    userReadableName: '7a Loans per Small Biz',
    extent: [0, 1]
  },
}


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

  // wire up the button
  var selectBox = document.getElementById('census-variable');
  google.maps.event.addDomListener(selectBox, 'change', function() {
    // selectBox.options[selectBox.selectedIndex].value
    renderRegions();
  });

  // state polygons only need to be loaded once, do them now
  loadMapShapes();

}



/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
  let regionGeometryPromise = $.ajax({
    url: window.topoUrl,
    dataType: 'json'
  })
  let sbaDataPromise = $.ajax({
    url: window.zipsUrl,
    dataType: 'json'
  })

  $.when(regionGeometryPromise, sbaDataPromise).done((regionGeometryResponse, sbaDataResponse) => {
    map.data.addGeoJson(regionGeometryResponse[0], { idPropertyName: 'GEOID10' })
    sbaData = sbaDataResponse[0].data
    renderRegions()
  })
}

/**
 * Loads the census data from a simulated API call to the US Census API.
 *
 * @param {string} variable
 */
function renderRegions() {
  clearRegions()

  if(fields[selectedField].extent === undefined) {
    fields[selectedField].extent = [
      sbaData.reduce((min, region) => Math.min(min, region[selectedField]), Number.MAX_VALUE),
      sbaData.reduce((max, region) => Math.max(max, region[selectedField]), Number.MIN_VALUE)
    ]
  }

  sbaData.forEach(function(row) {
    const censusVariable = row[selectedField]

    // update the existing row with the new data
    const feature = map.data.getFeatureById(row.borr_zip)
    if(feature)
      feature.setProperty('census_variable', censusVariable);
  });

  // update and display the legend
  document.getElementById('census-min').textContent =
      fields[selectedField].extent[0].toLocaleString();
  document.getElementById('census-max').textContent =
      fields[selectedField].extent[1].toLocaleString();
}

/** Removes census data from each shape on the map and resets the UI. */
function clearRegions() {
  map.data.forEach(function(row) {
    row.setProperty('census_variable', undefined);
  });
  document.getElementById('data-box').style.display = 'none';
  document.getElementById('data-caret').style.display = 'none';
}

/**
 * Applies a gradient style based on the 'census_variable' column.
 * This is the callback passed to data.setStyle() and is called for each row in
 * the data set.  Check out the docs for Data.StylingFunction.
 *
 * @param {google.maps.Data.Feature} feature
 */
function styleFeature(feature) {
  var low = [5, 69, 54];  // color of smallest datum
  var high = [151, 83, 34];   // color of largest datum

  // delta represents where the value sits between the min and max
  var delta = (feature.getProperty('census_variable') - fields[selectedField].extent[0]) /
      (fields[selectedField].extent[1] - fields[selectedField].extent[0]);

  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  // determine whether to show this shape or not
  var showRow = true;
  if (feature.getProperty('census_variable') == null ||
      isNaN(feature.getProperty('census_variable'))) {
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
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseInToRegion(e) {
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');

  var percent = (e.feature.getProperty('census_variable') - fields[selectedField].extent[0]) /
      (fields[selectedField].extent[1] - fields[selectedField].extent[0]) * 100;

  // update the label
  document.getElementById('data-label').textContent =
      e.feature.getProperty('NAME');
  document.getElementById('data-value').textContent =
      e.feature.getProperty('census_variable').toLocaleString();
  document.getElementById('data-box').style.display = 'block';
  document.getElementById('data-caret').style.display = 'block';
  document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}

