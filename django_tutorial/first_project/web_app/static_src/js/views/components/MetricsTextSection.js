import React from 'react'
import {connect} from 'react-redux'


/**
 * React container showing a dropdown to choose between showing regions and businesses
 */
export default function MetricsTextSection(props) {

  let numBusinesses = props.filteredBusinesses.length
  let numEmployees = props.filteredBusinesses.reduce((total, business) => business.jobs_supported + total, 0)
  let capitalDelivered = props.filteredBusinesses.reduce((total, business) => business.gross_approval + total, 0)

  return (
    <div>
      <h2>Metrics</h2>
      <p>In the last {props.selectedYear} years in {props.selectedRegion}...</p>
      <p>SBA has distributed {numBusinesses} loans</p>
      <p>SBA has delivered ${capitalDelivered} of capital</p>
      <p>SBA has supported {numEmployees} jobs</p>
    </div>
  )
}

