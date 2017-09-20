import React from 'react'

import { connect } from 'react-redux'

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from './GoogleMap'
import MapTooltip from './MapTooltip'
import FeatureTypeSelector from './FeatureTypeSelector'
import Metrics from './Metrics'

/**
 * Main container for the React app
 */
function App(props) {
  return (
    <div>
      <Metrics/>
      {/* TODO: toggle this part on/off w/ router
      <div id="controls" className="nicebox">
        <FeatureTypeSelector/>
        <hr/>
        <ColorControls/>
        <hr/>
        <FilterControls/>
        <hr/>
        <MapTooltip/>
      </div>
      <GoogleMap/>
      */}
    </div>
  )
}

export default connect()(App)