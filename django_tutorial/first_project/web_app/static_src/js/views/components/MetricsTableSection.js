import React from 'react'
import {connect} from 'react-redux'


export default function MetricsTableSection(props) {
  return (
    <div>
      <h2>Rank Header</h2>
      <table>
        <tr key={-1}>
          <td>Rank</td>
          <td>Business</td>
          <td>Google Rating</td>
        </tr>
        {/* TODO: do a real sortable table, don't just slice */}
        {Object.values(props.filteredBusinesses).slice(0, 10).map((business, index) => 
          <tr key={index}>
            <td>{index+1}</td>
            <td>{business.borr_name}</td>
            <td>{business.google_rating}</td>
          </tr>
        )}
      </table>
    </div>
  )
}

