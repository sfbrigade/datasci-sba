import React from 'react'

import { connect } from 'react-redux'

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from './GoogleMap'
import MapTooltip from './MapTooltip'

/**
 * Main container for the React app
 */
function App(props) {
  return (
    <div>
      <div id="controls" className="nicebox">
        <ColorControls/>
        <FilterControls/>
        <MapTooltip/>
      </div>
      <GoogleMap/>
    </div>
  )
}

export default connect()(App)