import React from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'


/**
 * React component powering the dropdown selection on the Metrics tab
 */
export default function MetricsFilters(props) {
  const onChange = e => props.onChange(e.target.name, e.target.value)
  return (
    <h2>
      <span>Show the impact SBA has provided in the</span>

      <select name="selectedRegionType" value={props.selectedRegionType} onChange={onChange}>
        {Object.keys(props.availableRegionTypes).map(regionType =>
          <option value={regionType} key={regionType}>{props.availableRegionTypes[regionType]}</option>
        )}
      </select>

      <select name="selectedRegion" value={props.selectedRegion} onChange={onChange}>
        {props.availableRegions.map(region => 
          <option value={region} key={region}>{region}</option>
        )}
      </select>

      <span>in the last</span>

      <select name="selectedYear" value={props.selectedYear} onChange={onChange}>
        {props.availableYears.map(year =>
          <option value={year} key={year}>{year} years</option>
        )}
      </select>

      <RaisedButton onClick={props.onSubmit} label="Submit"></RaisedButton>
    </h2>
  )
}

