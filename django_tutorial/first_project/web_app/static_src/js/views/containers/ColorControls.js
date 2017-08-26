import React from 'react'
import {connect} from 'react-redux'

import {getColorField, setColorField} from '../../redux/color'

import FieldBox from '../components/FieldBox'


const mapStateToProps = state => ({
	title: 'Color By',
	value: getColorField(state)
})

const mapDispatchToProps = dispatch => ({
	onChange: event => dispatch(setColorField(event.target.value))
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldBox)
