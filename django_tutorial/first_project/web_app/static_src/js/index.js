// TODO: add browserify or webpack to build pipeline, and break this into separate js files with imports,
// instead of just using section headers





////////////////// Initialization //////////////////////




/** main entry point for the initialization; should be called by google maps API once its JS is loaded */
window.init = function() {

  // this is the initial state that redux will contain; also serves as a reference for the state shape
  var initialState = {
    regionTypes: {
      'zip': {
        userReadableName: 'ZIP Code'
      }
    },
    regions: {

    },
    geometry: {

    },
    districts: {
      'SFDO': {
        userReadableName: 'San Francisco'
      }
    },
    ui: {
      selectedDistrict: 'SFDO',
      selectedRegionType: 'zip',
      color: {
        numQuantiles: 10,
        colorField: 'sba_per_small_bus',
        colorQuantiler: undefined
      },
      filter: {
        filterField: 'sba_per_small_bus',
        filterRange: [0, 1]
      }
    }
  }


  var store = Redux.createStore(rootReducer, initialState, Redux.applyMiddleware(ReduxThunk.default))

  // normally we would connect the store to a React app, but for now just call the renderView method
  // which (like React) is a 'pure' function of state
  store.subscribe(() => renderView(store.getState(), store.dispatch))

  // kick off an action which sets the district and region types to their defaults and loads the region data
  store.dispatch(setDistrictAndRegionType({}))
}






////////////////// Actions //////////////////////

function setColorField(colorField) {
  return {type: 'SET_COLOR_FIELD', colorField}
}

function setFilterField(filterField) {
  return {type: 'SET_FILTER_FIELD', filterField}
}

function setFilterRange(filterRange) {
  return {type: 'SET_FILTER_RANGE', filterRange}
}


function setDistrictAndRegionType({district, regionType}) {
  // This is a slightly more complicated action.  It uses Thunk middleware
  // so returns a function instead of an action object.  We do this so the
  // function can fetch data asynchronously from the server, and then dispatch
  // an action that contains the full geometry and region data from the server
  return (dispatch, getState) => {  
    if(district === undefined) {
      district = getSelectedDistrict(getState())
    }
    if(regionType === undefined) {
      regionType = getSelectedRegionType(getState())
    }

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
    return Promise.all([sbaDataPromise, regionGeometryPromise])
      .then(([sbaData, geometry]) => {

        // convert the SBA data from an array of regions to a map from region code (eg zip) to region data, for easy
        // lookup by region code
        let regions = {}
        sbaData.data.forEach(sbaDatum => {
          // HACK: API currently returns string values for fields that are numeric in the PG DB;
          // convert them to numbers now, but ideally the API would return numbers not strings
          Object.keys(fields).forEach(field => {
            sbaDatum[field] = parseFloat(sbaDatum[field])
          })

          regions[sbaDatum.region] = sbaDatum
        })

        // dispatch an action that will set the actual geometry & region data on the state
        dispatch(setDistrictRegionTypeAndRegions({district, regionType, geometry, regions}))

      })

  // TODO error handling if either request failed
   
  }
}

function setDistrictRegionTypeAndRegions({district, regionType, geometry, regions}) {
  return {
    type: 'SET_DISTRICT_REGION_TYPE_AND_REGIONS',
    district,
    regionType,
    geometry,
    regions
  }
}





////////////////// State Selectors //////////////////////


const getRegions            = (state) => state.regions
const getGeometry           = (state) => state.geometry
const getSelectedDistrict   = (state) => state.ui.selectedDistrict
const getSelectedRegionType = (state) => state.ui.selectedRegionType
const getColorField         = (state) => state.ui.color.colorField
const getNumColorQuantiles  = (state) => state.ui.color.numQuantiles
const getColorQuantiler     = (state) => state.ui.color.colorQuantiler
const getFilterField        = (state) => state.ui.filter.filterField
const getFilterRange        = (state) => state.ui.filter.filterRange

/**
 * @param {Object} state
 * @param {String} field if undefined, defaults to currently selected filter field in state
 * @return {number[]} array of length 2, containing min and max values of the given field
 * across all regions
 */
function getFieldExtent(state, field) {
  if(field === undefined) {
    field = getFilterField(state)
  }
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE

  Object.values(getRegions(state)).forEach(region => {
    if(region[field] != null && !isNaN(region[field])) {
      min = Math.min(min, region[field])
      max = Math.max(max, region[field])
    }
  })
  return [min, max]
}





////////////////// Reducers //////////////////////

function filterReducer(state, action) {
  const {type,
    filterField=getFilterField(state),
    filterRange} = action
  switch(type) {
    case 'SET_FILTER_FIELD':
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          filter: {
            filterField,
            filterRange: getFieldExtent(state, filterField)
          }
        })
      })

    case 'SET_FILTER_RANGE':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          filter: {
            filterField,
            filterRange: filterRange
          }
        })
      })

    default: return state
  }
}

function colorReducer(state, action) {
  const {type, colorField=getColorField(state)} = action
  switch(type) {
    case 'SET_COLOR_FIELD':
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          color: {
            numQuantiles: getNumColorQuantiles(state),
            colorField,
            colorQuantiler: new Quantiler(
              Object.values(getRegions(state)).map(region => region[colorField]),
              getNumColorQuantiles(state))
          }
        })
      })

    default: return state
  }
}

function regionsReducer(state, action) {
  const {type, district, regionType, geometry, regions} = action
  switch(type) {
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        geometry,
        regions,
        ui: Object.assign({}, state.ui, {
          selectedDistrict: district,
          selectedRegionType: regionType,
        })
      })

    default: return state
  }
}

/**
 * Utility function that returns a reducer that simply applies all
 * of the given reducers to the state
 * @param {Function[]} reducers
 * @return {Function}
 */
function composeReducers(reducers) {
  return function(state, action) {
    return reducers.reduce(function(_state, reducer) {
      return reducer(_state, action)
    }, state)
  }
}


// this is the "main" reducer that will be exported and plugged into the Redux store
const rootReducer = composeReducers([regionsReducer, filterReducer, colorReducer])







////////////////// Rendering //////////////////////


// Normally these would be implemented as React components, but until we get a babel/webpack
// build process set up to enable JSX, we'll implement them using vanilla JS and jQuery.
//
// We'll still follow a React-like convention where the rendering is a (mostly) pure function
// of the state.  But since we don't have React's shadow DOM, we'll keep some external variables to
// indicate whether the UI has been initialized and avoid initializing it again -- thus our render
// functions aren't exactly pure, but at least they're deterministic and idempotent.
// 
// Also once we set up babel/webpack this could be broken into 3 widgets: Map, ColorControls, FilterControls



function renderView(state, dispatch) {
  renderMap(state, dispatch)
  renderColorControls(state, dispatch)
  renderFilterControls(state, dispatch)
}



var initializedColorControls = false
function renderColorControls(state, dispatch) {
  if(!initializedColorControls) {
    initializedColorControls = true

    let colorSelectBox = $('#color-select');

    getOrderedFields().forEach(key => {
      colorSelectBox.append($('<option>', {
        text: fields[key].userReadableName,
        value: key,
        selected: key == getColorField(state)
      }))
    })

    colorSelectBox.change(() => {
      let newColorField = colorSelectBox.find(':selected').prop('value')
      dispatch(setColorField(newColorField))
    });
  }
}



var initializedFilterControls = false
function renderFilterControls(state, dispatch) {

  if(!initializedFilterControls) {
    initializedFilterControls = true

    let filterSelectBox = $('#filter-select')

    getOrderedFields().forEach(key => {
      filterSelectBox.append($('<option>', {
        text: fields[key].userReadableName,
        value: key,
        selected: key == getFilterField(state)
      }))
    })

    filterSelectBox.change(() => {
      let filterField = filterSelectBox.find(':selected').prop('value')
      dispatch(setFilterField(filterField))
    });

    $('#filter-slider').slider({
      range: true,
      slide(event, ui) {
        let newFilterRange = ui.values.slice()
        dispatch(setFilterRange(newFilterRange))
      },
      // dummy values
      min: 0,
      max: 1,
      step: 0.1,
      values: [0, 1]
    })
  }


  const filterRange = getFilterRange(state)
  const fieldExtent = getFieldExtent(state)

  $('#filter-min').text(round(filterRange[0], 1))
  $('#filter-max').text(round(filterRange[1], 1))

  $('#filter-slider').slider({
    min: fieldExtent[0],
    max: fieldExtent[1],
    step: (fieldExtent[1] - fieldExtent[0]) / 100,
    values: fieldExtent.slice()
  })
}


var map; // the instance of google.maps.Map
var renderedGeometry; // pointer to the last state.geometry that was rendered, so we can avoid re-rendering if it hasn't changed
var mouseoverListener; // instance of google.maps.MapsEventListener; saved so we can remove old listener before adding new one
var mouseoutListener; // instance of google.maps.MapsEventListener; saved so we can remove old listener before adding new one
var renderedColorState; // store the contents of state.color in a global variable so that styleFeature function can reference it
function renderMap(state, dispatch) {

  // HACK: the styleFeature function depends on the state.  We could drop and re-add it, but it turns out
  // that's rather slow.  Instead, we store the state.color properties in a variable so that the styleFeature
  // function can fetch it on demand.  Note that we do this before any reference to styleFeature, so that
  // styleFeature always has this field set
  renderedColorState = state.ui.color


  if(!map) {
    // initialize the map if it hasn't already been done
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

    map.data.setStyle(styleFeature)
  }

  // the mouse listeners may depend on the current state, so drop and re-add them
  if(mouseoverListener) {
    mouseoverListener.remove()
  }
  if(mouseoutListener) {
    mouseoutListener.remove();
  }
  mouseoverListener = map.data.addListener('mouseover', createMouseoverListener(state))
  mouseoutListener = map.data.addListener('mouseout', createMouseoutListener(state))


  // again for performance reasons, only update the features' geometry if it has changed
  if(getGeometry(state) !== renderedGeometry) {
    map.data.forEach((feature) => map.data.remove(feature))
    map.data.addGeoJson(getGeometry(state), { idPropertyName: 'GEOID10' })
    renderedGeometry = getGeometry(state)
  }

  // recolor all features.  We could also only do this if any of the color or filter fields have changed,
  // but for now almost any state change involves a color or filter field change, so no harm in updating always
  map.data.forEach((feature) => {
    // set all features to undefined (thus invisible) to start, then we'll give them a color if we find
    // data for the region and it's inside the current filter range
    feature.setProperty('colorVariable', undefined)

    let region = getRegions(state)[feature.getId()]
    if(region) {
      const colorVariable = region[getColorField(state)]
      const filterVariable = region[getFilterField(state)]
      const filterRange = getFilterRange(state)

      if(filterRange[0] <= filterVariable && filterVariable <= filterRange[1]) {
        feature.setProperty('colorVariable', colorVariable);    
      }
    }
  })
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
  let quantile = renderedColorState.colorQuantiler.getQuantile(feature.getProperty('colorVariable'))
  let numQuantiles = renderedColorState.numQuantiles

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
function createMouseoverListener(state) {
  return (e) => {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty('state', 'hover');

    sbaDatum = getRegions(state)[e.feature.getId()]

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
}

/**
 * Responds to the mouse-out event on a region.
 *
 * @param {?google.maps.MouseEvent} e
 */
function createMouseoutListener(state) {
  return (e) => {
    // reset the hover state, returning the border to normal
    e.feature.setProperty('state', 'normal');
    $('#tooltip').stop().animate({opacity: 0}, 500);
  }
}







////////////////// Utilities //////////////////////


// keeps track of which fields we let the user select for coloring & filtering
const fields = {
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

/**
 * @return {String[]} all the keys in the 'fields' object, ordered by their user-readable names
 */
function getOrderedFields() {
  let orderedFields = Object.keys(fields)
  orderedFields.sort((a, b) => fields[a].userReadableName < fields[b].userReadableName)
  return orderedFields
}


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
