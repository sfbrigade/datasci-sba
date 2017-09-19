import React from 'react'

import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from './GoogleMap'
import MapTooltip from './MapTooltip'
import FeatureTypeSelector from './FeatureTypeSelector'

/**
 * Main container for the React app
 */
function App(props) {
  return (
    <div>
      <div>
        <header>
          <Link to="/">Home</Link>
          <Link to="/about-us">About</Link>
        </header>

        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/about-us" component={About} />
        </main>
      </div>
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
    </div>
  )
}

export default connect()(App)
