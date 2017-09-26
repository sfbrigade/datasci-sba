import React from 'react'

import { Route, Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from '../components/GoogleMap'
import MapTooltip from './MapTooltip'
import FeatureTypeSelector from './FeatureTypeSelector'
import Metrics from './Metrics'

const HomePage = () => {
  return (
    <MuiThemeProvider>
      <div>
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
      </div>
    </MuiThemeProvider>
  )
}

/* Main container for the React app */
function App() {
  return (
    <div>
      <nav>Nav</nav>
      <switch>
        <Route path="/" component={Metrics} />
        <Route path="/map" component={Map} />
      </switch>
    </div>
  )
}

export default App;
