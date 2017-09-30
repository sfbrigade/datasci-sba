import React from 'react'
import { Route, NavLink, Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Metrics from './Metrics'
import Map from './Map'

import AppBar from 'material-ui/AppBar'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem'
// import NavItem from 'material-ui/NavItem'

import FontIcon from 'material-ui/FontIcon';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

const iconStyles = {
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
        <AppBar
          title="SBA"
          style={appBarStyles}
          iconElementRight = {
            <div>
              <NavLink to="/app" activeClassName="active">
                <FontIcon className="material-icons" style={iconStyles}>insert_chart</FontIcon>
              </NavLink>
              <NavLink to="/app/map" activeClassName="active">
                <FontIcon className="material-icons" style={iconStyles}>place</FontIcon>
              </NavLink>
            </div>
          }
        />
        <switch>
          <Route path="/app" exact component={Metrics} />
          <Route path="/app/map" exact component={Map} />
        </switch>
      </div>
    </MuiThemeProvider>
  )
}

export default App;
