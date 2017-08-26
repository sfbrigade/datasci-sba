import {createStore, applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import regionsReducer, {setDistrictAndRegionType} from './redux/regions'
import colorReducer from './redux/color'
import filterReducer from './redux/filter'

import App from './views/containers/App'

import {composeReducers} from './utilities'


/** main entry point for the initialization; should be called by google maps API once its JS is loaded */
window.init = function() {

  // this is the initial state that redux will contain; also serves as a reference for the state shape
  const initialState = {
    regionTypes: {
      'zip': {
        userReadableName: 'ZIP Code'
      }
    },
    regions: {
      // will be filled in with response from API endpoint
    },
    geometry: {
      // will be filled in with response from API endpoint
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
      },
      mousedRegionId: undefined
    }
  }

  // this is the "main" reducer that will be exported and plugged into the Redux store
  const rootReducer = composeReducers([regionsReducer, filterReducer, colorReducer])


  const store = createStore(rootReducer, initialState, applyMiddleware(ReduxThunk))

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  )

  // kick off an action which sets the district and region types to their defaults and loads the region data
  store.dispatch(setDistrictAndRegionType({}))
}

