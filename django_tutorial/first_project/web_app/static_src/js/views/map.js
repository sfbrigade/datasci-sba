import {getGeometry, getRegions} from '../redux/regions'
import {getColorField} from '../redux/color'
import {getFilterField, getFilterRange} from '../redux/filter'


var map; // the instance of google.maps.Map
var renderedGeometry; // pointer to the last state.geometry that was rendered, so we can avoid re-rendering if it hasn't changed
var mouseoverListener; // instance of google.maps.MapsEventListener; saved so we can remove old listener before adding new one
var mouseoutListener; // instance of google.maps.MapsEventListener; saved so we can remove old listener before adding new one
var renderedColorState; // store the contents of state.color in a global variable so that styleFeature function can reference it


export default function renderMap(state, dispatch) {

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

    let sbaDatum = getRegions(state)[e.feature.getId()]

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




