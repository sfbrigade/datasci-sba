import React from 'react'
import {connect} from 'react-redux'

import {Card, CardTitle} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import DropDownMenu from 'material-ui/DropDownMenu'
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

      <DropDownMenu name="selectedRegionType" value={props.selectedRegionType} onChange={createOnChange("selectedRegionType")} style={{fontSize: '20px'}}>
        <MenuItem value="false" primaryText="Select Region Type"/>
        {Object.keys(props.availableRegionTypes).map(regionType =>
          <MenuItem value={regionType} key={regionType} primaryText={props.availableRegionTypes[regionType]}/>
        )}
      </DropDownMenu>

      <DropDownMenu name="selectedRegion" value={props.selectedRegion} onChange={createOnChange("selectedRegion")} style={{fontSize: '20px', width: '300px'}}
          autoWidth={false}>
          <MenuItem value="false" primaryText="Select Subregion"/>
        {props.availableRegions.map(region =>
          <MenuItem value={region} key={region} primaryText={region}/>
        )}
      </DropDownMenu>

      <DropDownMenu name="selectedYear" value={props.selectedYear} onChange={createOnChange("selectedYear")} style={{fontSize: '20px'}}>
      <MenuItem value="false" primaryText="Select Number of Years"/>
        {props.availableYears.map(year =>
          <MenuItem value={year} key={year} primaryText={year + " years"}/>
        )}
      </DropDownMenu>

      <RaisedButton onClick={props.onSubmit} label="Submit" primary={true} className="metrics-filters-button"/>
    </div>
  )
}

