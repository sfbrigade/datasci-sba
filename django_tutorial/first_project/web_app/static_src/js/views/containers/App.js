import React from 'react'

import { Route, Link } from 'react-router-dom'

import Map from './Map'
import Metrics from './Metrics'

const HomePage = () => {
  return (
    <div>
      Home Page of SBA App
    </div>
  );
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
