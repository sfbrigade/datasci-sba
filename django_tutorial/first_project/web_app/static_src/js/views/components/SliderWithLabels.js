import React from 'react'

import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css';

import { round } from '../../utilities'

/**
 * Wraps the rc-slider component and puts labels on the currently selected min/max values
 */
export default function SliderWithLabels(props) {
  return (
    <div>
      <div id="filter-min">{round(props.value[0], 1)}</div>
      <div id="filter-max">{round(props.value[1], 1)}</div>
      <Range {...props}/>
    </div>
  )
}