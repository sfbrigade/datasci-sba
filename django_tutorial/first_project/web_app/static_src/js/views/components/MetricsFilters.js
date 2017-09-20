import React from 'react'
import {connect} from 'react-redux'


/**
 * React component powering the dropdown selection on the Metrics tab
 */
export default function MetricsFilters(props) {
  const onChange = e => props.onChange(e.target.name, e.target.value)
  return (
    <div>
      <span>Show the value SBA has provided in</span>

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

      <input type="submit" value="Submit" onClick={props.onSubmit}/>

    </div>
  )
}

