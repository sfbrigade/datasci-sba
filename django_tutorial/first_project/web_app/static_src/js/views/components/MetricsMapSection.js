import React from 'react'
import {connect} from 'react-redux'

import {FEATURE_TYPE_BUSINESS} from '../../redux/feature'

import GoogleMap from './GoogleMap'

export default function MetricsMapSection(props) {
  return (
    <div>
      <h2>Map</h2>
      <div style={{height:'400px'}}>
        <GoogleMap
          featureType={FEATURE_TYPE_BUSINESS}
          features={props.filteredBusinesses}
          useClusterer={false}
          useFilter={false}
          onMouseover={(featureId) => {if(featureId) console.log(props.filteredBusinesses[featureId].borr_name)}}/>
      </div>
    </div>
  )
}

