import React from 'react'
import {connect} from 'react-redux'

import {Card, CardTitle} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
// import DropDownMenu from 'material-ui/DropDownMenu'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'


/**
 * React component powering the dropdown selection on the Metrics tab
 */
export default function MetricsFilters(props) {
  const createOnChange = (name) => {
    return (e, key, value) => props.onChange(name, value)
  }
  return (
    <div className="metrics-filters">
      <div className="metrics-filters-text">Show the value SBA has provided in</div>
      <SelectField className="metrics-filter-select" name="selectedRegionType" floatingLabelText="Select Region Type" value={props.selectedRegionType} onChange={createOnChange("selectedRegionType")} style={{textAlign: 'left', fontSize: '20px'}}>
        {Object.keys(props.availableRegionTypes).map(regionType =>
          <MenuItem value={regionType} key={regionType} primaryText={props.availableRegionTypes[regionType]}/>
        )}
      </SelectField>

      <SelectField className="metrics-filter-select" name="selectedRegion" floatingLabelText="Select Region" value={props.selectedRegion} onChange={createOnChange("selectedRegion")} style={{textAlign: 'left', fontSize: '20px'}} autoWidth={false}>
        {props.availableRegions.map(region =>
          <MenuItem value={region} key={region} primaryText={region}/>
        )}
      </SelectField>

      <div className="metrics-filters-text">in the last</div>

      <SelectField className="metrics-filter-select" name="selectedYear" floatingLabelText="Select Year" value={props.selectedYear} onChange={createOnChange("selectedYear")} style={{textAlign: 'left', fontSize: '20px'}}>
        {props.availableYears.map(year =>
          <MenuItem value={year} key={year} primaryText={year + " years"}/>
        )}
      </SelectField>

      <RaisedButton onClick={props.onSubmit} label="Submit" primary={true} className="metrics-filters-button" style={{backgroundColor: '#00E676'}}/>
    </div>
  )
}

