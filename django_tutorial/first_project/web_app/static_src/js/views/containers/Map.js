import React from 'react'
import { connect } from 'react-redux'

import {getFeatureState, getFilterState, getColorState} from '../../redux/root'
import {getGeometry, getFeatures, setMousedFeatureId, getFeatureType } from '../../redux/feature'
import {getColorField, getColorQuantiler, getNumColorQuantiles} from '../../redux/color'
import {getFilterField, getFilterRange} from '../../redux/filter'

import ColorControls from './ColorControls'
import FilterControls from './FilterControls'
import GoogleMap from '../components/GoogleMap'
import MapTooltip from './MapTooltip'
import FeatureTypeSelector from './FeatureTypeSelector'
import Metrics from './Metrics'

const Map = ({props}) => {
  return (
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
  );
}

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


export default connect(mapStateToProps, mapDispatchToProps)(Map)

