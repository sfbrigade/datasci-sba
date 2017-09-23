import React from 'react'

import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from '../components/GoogleMap'
import MapTooltip from './MapTooltip'
import FeatureTypeSelector from './FeatureTypeSelector'
import Metrics from './Metrics'

import {getFeatureState, getFilterState, getColorState} from '../../redux/root'
import {getGeometry, getFeatures, setMousedFeatureId, getFeatureType } from '../../redux/feature'
import {getColorField, getColorQuantiler, getNumColorQuantiles} from '../../redux/color'
import {getFilterField, getFilterRange} from '../../redux/filter'

/**
 * Main container for the React app
 */
function App(props) {
  return (
    <div>
<<<<<<< HEAD
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
=======
      {/* HACK: have /app/?map serve the old map, while /app/ serves the metrics
      TODO: toggle this part on/off w/ router, instead of this hack with window.location */}
      {window.location.search === '?map' ||
        <Metrics/>
      }
      {window.location.search === '?map' &&
        <div style={{height: '100%'}}>
          <div id="controls" className="nicebox">
            <FeatureTypeSelector/>
            <hr/>
            <ColorControls/>
            <hr/>
            <FilterControls/>
            <hr/>
            <MapTooltip/>
          </div>
          <GoogleMap {...props} useFilter={true} useClusterer={true}/>
        </div>
      }
>>>>>>> c51922478d7dbc8ddbb94a447ce70577e6ac5c6c
    </div>
  )
}

<<<<<<< HEAD
export default connect()(App)
=======
const mapStateToProps = state => ({
  geometry: getGeometry(getFeatureState(state)),
  features: getFeatures(getFeatureState(state)),
  featureType: getFeatureType(getFeatureState(state)),

  colorField: getColorField(getColorState(state)),
  colorQuantiler: getColorQuantiler(getColorState(state)),
  numColorQuantiles: getNumColorQuantiles(getColorState(state)),

  filterField: getFilterField(getFilterState(state)),
  filterRange: getFilterRange(getFilterState(state))
})

const mapDispatchToProps = {
  onMouseover: setMousedFeatureId
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
>>>>>>> c51922478d7dbc8ddbb94a447ce70577e6ac5c6c
