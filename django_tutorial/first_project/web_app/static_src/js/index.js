import {createStore, applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'

import regionsReducer, {setDistrictAndRegionType} from './redux/regions'
import colorReducer from './redux/color'
import filterReducer from './redux/filter'

import renderMap from './views/map'
import renderColorControls from './views/color'
import renderFilterControls from './views/filter'

import {composeReducers} from './utilities'




  // this is the "main" reducer that will be exported and plugged into the Redux store
const rootReducer = composeReducers([regionsReducer, filterReducer, colorReducer])



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



  var store = createStore(rootReducer, initialState, applyMiddleware(ReduxThunk))

  // normally we would connect the store to a React app, but for now just call the renderView method
  // which (like React) is a 'pure' function of state
  store.subscribe(() => renderView(store.getState(), store.dispatch))

  // kick off an action which sets the district and region types to their defaults and loads the region data
  store.dispatch(setDistrictAndRegionType({}))
}

