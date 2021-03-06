import React from 'react'
import {connect} from 'react-redux'
import {Card, CardHeader} from 'material-ui/Card';

import {FEATURE_TYPE_BUSINESS} from '../../redux/feature'

import GoogleMap from './GoogleMap'

export default function MetricsMapSection(props) {
  return (
    <Card className="metrics-section metrics-map">
      <CardHeader title="Map" />
      <div style={{height:'400px'}}>
        <GoogleMap
          featureType={FEATURE_TYPE_BUSINESS}
          features={props.filteredBusinesses}
          useClusterer={true}
          useFilter={false}
          onMouseover={(featureId) => {}}/>
      </div>
    </Card>
  )
}

