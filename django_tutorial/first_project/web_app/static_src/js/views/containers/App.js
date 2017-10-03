import React from 'react'
import { Route, NavLink, Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Metrics from './Metrics'
import Map from './Map'

import AppBar from 'material-ui/AppBar'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton';
// import NavItem from 'material-ui/NavItem'

import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

const linkStyles = {
  marginRight: 24,
  marginTop: 5,
  fontSize: '40px',
  color: '#fff'
};

const appBarStyles = {
  backgroundColor: '#2296F3',

};

/* Main container for the React app */
function App() {
  return (
    <MuiThemeProvider>
      <div>
        {/* HACK: have /app/?map serve the old map, while /app/ serves the metrics
        TODO: toggle this part on/off w/ router, instead of this hack with window.location */}
        <AppBar
          title="SBA"
          style={appBarStyles}
          iconElementLeft = {<div></div>}
          iconElementRight = {
            <div>
              <a href="/app">
                <FlatButton label="Metrics" style={linkStyles} />
              </a>
              <a href="/app?map">
                <FlatButton label="Map" style={linkStyles} />
              </a>
            </div>
          }
        />
        {window.location.search === '?map' || <Metrics/>}
        {window.location.search === '?map' && <Map/>}

        {/* Here is the react-router code that we should use once the map issues and state sharing
        are fixed */}
        {/*<AppBar
          title="SBA"
          style={appBarStyles}
          iconElementLeft = {<div></div>}
          iconElementRight = {
            <div>
              <NavLink to="/app" activeClassName="active">
                <FlatButton label="Metrics" style={linkStyles} />
              </NavLink>
              <NavLink to="/app/map" activeClassName="active">
                <FlatButton label="Map" style={linkStyles} />
              </NavLink>
            </div>
          }
        />
        <switch>
          <Route path="/app" exact component={Metrics} />
          <Route path="/app/map" exact component={Map} />
        </switch>*/}
      </div>
    </MuiThemeProvider>
  )
}

export default App;
