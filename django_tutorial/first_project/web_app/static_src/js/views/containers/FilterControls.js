import React from 'react'
import {connect} from 'react-redux'

import {getFilterField, getFilterRange, getFieldExtent, setFilterField, setFilterRange} from '../../redux/filter'

import FieldBox from '../components/FieldBox'
import SliderWithLabels from '../components/SliderWithLabels'


/**
 * React container showing the filter field selection, and filter range slider
 */
function FilterControls(props) {
  return (
    <div>
      <FieldBox title="Filter By" value={props.field} onChange={props.onChangeField}/>
      <SliderWithLabels min={props.filterExtent[0]} max={props.filterExtent[1]} value={props.filterRange}
        step={(props.filterExtent[1]-props.filterExtent[0])/100}
        allowCross={false} onChange={props.onChangeRange}/>
    </div>
  )
}


const mapStateToProps = state => ({
  field: getFilterField(state),
  filterRange: getFilterRange(state),
  filterExtent: getFieldExtent(state)
})

const mapDispatchToProps = {
  onChangeField: setFilterField,
  onChangeRange: setFilterRange
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterControls)
