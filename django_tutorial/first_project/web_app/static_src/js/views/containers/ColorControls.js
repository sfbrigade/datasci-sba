import React from 'react'
import {connect} from 'react-redux'

import { getColorState, getRegionState } from '../../redux/root'
import {getColorField, setColorField, getColorQuantiler} from '../../redux/color'
import { getRegions, getMousedRegion } from '../../redux/regions'

import { calculateColor } from '../../utilities'

import FieldBox from '../components/FieldBox'
import RegionHistogram from '../components/RegionHistogram'

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
      <RegionHistogram data={props.data} colorFunction={value => calculateColor(value, props.quantiler)}
        lines={props.mousedRegion ? [props.mousedRegion[props.field]] : []}/>
    </div>
  )
}


const mapStateToProps = state => ({
  field: getColorField(getColorState(state)),
  quantiler: getColorQuantiler(getColorState(state)),
  data: Object.values(getRegions(getRegionState(state))).map(region => region[getColorField(getColorState(state))]),	// TODO: memoize
  mousedRegion: getMousedRegion(getRegionState(state))
})

const mapDispatchToProps = {
  onChangeField: setColorField
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorControls)

