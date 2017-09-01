import React from 'react'
import { connect } from 'react-redux'

import { getFeatureState } from '../../redux/root'
import { getMousedFeature } from '../../redux/feature'

import {fields, getOrderedFields, round} from '../../utilities'

/**
 * Renders the tooltip showing data about a specific feature when that feature is moused over
 */
function MapTooltip(props) {
  return props.mousedFeature !== undefined && (
    <div id="tooltip">
      <table>
        <thead>
          <tr>
	        <td>Zipcode:</td>
	        <td>{props.mousedFeature.region}</td>
	      </tr>
	    </thead>
        <tbody>
	        {getOrderedFields().map(field => (
	          <tr key={field}>
	            <td>{fields[field].userReadableName}</td>
	            <td>{round(props.mousedFeature[field], 1)}</td>
	          </tr>
	        ))}
	    </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = state => ({
  mousedFeature: getMousedFeature(getFeatureState(state))
})

export default connect(mapStateToProps)(MapTooltip)