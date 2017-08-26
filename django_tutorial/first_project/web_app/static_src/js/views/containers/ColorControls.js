import React from 'react'
import {connect} from 'react-redux'

import {getColorField, setColorField} from '../../redux/color'

import FieldBox from '../components/FieldBox'

/*
 * React container for the color dropdown and controls.  Note that for now we
 * can get by with just connecting a FieldBox component with redux, since
 * the color controls don't do anything except the field selection dropdown.
 */


const mapStateToProps = state => ({
  title: 'Color By',
  value: getColorField(state)
})

const mapDispatchToProps = {
  onChange: setColorField
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldBox)
