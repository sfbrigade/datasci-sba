import React from 'react'
import {connect} from 'react-redux'

import {getFilterField, getFilterRange, getFieldExtent, setFilterField, setFilterRange} from '../../redux/filter'

import FieldBox from '../components/FieldBox'
import SliderWithLabels from '../components/SliderWithLabels'


function FilterControls(props) {
	return (
		<div>
			<FieldBox title="Filter By" value={props.field} onChange={event => props.onChangeField(event.target.value)}/>
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

const mapDispatchToProps = dispatch => ({
	onChangeField: field => dispatch(setFilterField(field)),
	onChangeRange: range => dispatch(setFilterRange(range))
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterControls)
