import React from 'react'
import {connect} from 'react-redux'

import { getColorState, getFeatureState } from '../../redux/root'
import {getColorField, setColorField, getColorQuantiler} from '../../redux/color'
import { getFeatures, getMousedFeature } from '../../redux/feature'

import { calculateColor } from '../../utilities'

import FieldBox from '../components/FieldBox'
import Histogram from '../components/Histogram'

/*
 * React container for the color dropdown and controls.  Note that for now we
 * can get by with just connecting a FieldBox component with redux, since
 * the color controls don't do anything except the field selection dropdown.
 */


/**
 * React container showing the color field selection, and color range slider
 */
function ColorControls(props) {
  return (
    <div>
      <FieldBox title="Color By" value={props.field} onChange={props.onChangeField}/>
      <Histogram data={props.data} colorFunction={value => calculateColor(value, props.quantiler)}
        lines={props.mousedFeature ? [props.mousedFeature[props.field]] : []}/>
    </div>
  )
}


const mapStateToProps = state => ({
  field: getColorField(getColorState(state)),
  quantiler: getColorQuantiler(getColorState(state)),
  data: Object.values(getFeatures(getFeatureState(state))).map(feature => feature[getColorField(getColorState(state))]),	// TODO: memoize
  mousedFeature: getMousedFeature(getFeatureState(state))
})

const mapDispatchToProps = {
  onChangeField: setColorField
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorControls)

