import React from 'react'
import { Route, NavLink, Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Metrics from './Metrics'
import Map from './Map'


/* Main container for the React app */
function App() {
  return (
    <MuiThemeProvider>
      <div>
        <nav>
          <NavLink to="/app" activeClassName="active">Metrics</NavLink>
          <NavLink to="/app/map" activeClassName="active">Map</NavLink>
        </nav>
        <switch>
          <Route path="/app" exact component={Metrics} />
          <Route path="/app/map" exact component={Map} />
        </switch>
      </div>
    </MuiThemeProvider>
  )
}

export default App;
