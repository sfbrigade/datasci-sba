import React from 'react'
import {connect} from 'react-redux'

import { getFilterState, getRegionState } from '../../redux/root'
import {getFilterField, getFilterRange, getFieldExtent, setFilterField, setFilterRange} from '../../redux/filter'
import { getRegions } from '../../redux/regions'

import FieldBox from '../components/FieldBox'
import SliderWithHistogramAndLabels from '../components/SliderWithHistogramAndLabels'


/**
 * React container showing the filter field selection, and filter range slider
 */
function FilterControls(props) {
  return (
    <div>
      <FieldBox title="Filter By" value={props.field} onChange={props.onChangeField}/>
      <SliderWithHistogramAndLabels filterExtent={props.filterExtent} filterRange={props.filterRange}
        onChangeRange={props.onChangeRange} data={props.data}/>
    </div>
  )
}


const mapStateToProps = state => ({
  field: getFilterField(getFilterState(state)),
  filterRange: getFilterRange(getFilterState(state)),
  filterExtent: getFieldExtent(getRegionState(state), getFilterField(getFilterState(state))),
  data: Object.values(getRegions(getRegionState(state))).map(region => region[getFilterField(getFilterState(state))]) // TODO: memoize
})

const mapDispatchToProps = {
  onChangeField: setFilterField,
  onChangeRange: setFilterRange
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterControls)
