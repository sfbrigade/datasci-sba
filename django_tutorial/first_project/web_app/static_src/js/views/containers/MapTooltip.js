import React from 'react'
import { connect } from 'react-redux'

import {getMousedRegion} from '../../redux/regions'

import {fields, getOrderedFields, round} from '../../utilities'

/**
 * Renders the tooltip showing data about a specific region when that region is moused over
 */
function MapTooltip(props) {
  return props.mousedRegion !== undefined && (
    <div id="tooltip">
      <table>
        <thead>
          <tr>
	        <td>Zipcode:</td>
	        <td>{props.mousedRegion.region}</td>
	      </tr>
	    </thead>
        <tbody>
	        {getOrderedFields().map(field => (
	          <tr key={field}>
	            <td>{fields[field].userReadableName}</td>
	            <td>{round(props.mousedRegion[field], 1)}</td>
	          </tr>
	        ))}
	    </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = state => ({
  mousedRegion: getMousedRegion(state)
})

export default connect(mapStateToProps)(MapTooltip)