import React from 'react'

import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css';

import { round } from '../../utilities'

import Histogram from './Histogram'
import SliderWithLabels from './SliderWithLabels'

/**
 * Wraps the rc-slider component with labels and a histogram showing the values being filtered
 */
export default class SliderWithHistogramAndLabels extends React.Component {

  histogramColorFunction = (value) => {
  	return this.props.filterRange[0] < value && value < this.props.filterRange[1]
  	  ? '#000'
  	  : '#aaa'
  }

  render() {
    return (
      <div>
        <Histogram
          data={this.props.data}
          colorFunction={this.histogramColorFunction}
          lines={this.props.filterRange}/>
        <SliderWithLabels
          min={this.props.filterExtent[0]}
          max={this.props.filterExtent[1]}
          value={this.props.filterRange}
          step={(this.props.filterExtent[1]-this.props.filterExtent[0])/100}
          allowCross={false}
          onChange={this.props.onChangeRange} />
      </div>
    )
  }
}