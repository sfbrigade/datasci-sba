import React from 'react'
import {connect} from 'react-redux'

import { getFilterState, getFeatureState } from '../../redux/root'
import {getFilterField, getFilterRange, getFieldExtent, setFilterField, setFilterRange} from '../../redux/filter'
import { getFeatures, getFields, getOrderedFieldKeys } from '../../redux/feature'

import FieldBox from '../components/FieldBox'
import SliderWithHistogramAndLabels from '../components/SliderWithHistogramAndLabels'


/**
 * React container showing the filter field selection, and filter range slider
 */
function FilterControls(props) {
  return (
    <div>
      <FieldBox title="Filter" value={props.field} onChange={props.onChangeField}
        fields={props.fields} orderedFieldKeys={props.orderedFieldKeys}/>
      <SliderWithHistogramAndLabels filterExtent={props.filterExtent} filterRange={props.filterRange}
        onChangeRange={props.onChangeRange} data={props.data}/>
    </div>
  )
}


const mapStateToProps = state => ({
  fields: getFields(getFeatureState(state)),
  orderedFieldKeys: getOrderedFieldKeys(getFeatureState(state)),
  field: getFilterField(getFilterState(state)),
  filterRange: getFilterRange(getFilterState(state)),
  filterExtent: getFieldExtent(getFeatureState(state), getFilterField(getFilterState(state))),
  data: Object.values(getFeatures(getFeatureState(state))).map(feature => feature[getFilterField(getFilterState(state))]) // TODO: memoize
})

const mapDispatchToProps = {
  onChangeField: setFilterField,
  onChangeRange: setFilterRange
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterControls)
