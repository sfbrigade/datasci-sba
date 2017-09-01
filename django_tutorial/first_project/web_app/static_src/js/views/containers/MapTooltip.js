import React from 'react'
import { connect } from 'react-redux'

import { getFeatureState } from '../../redux/root'
import { getMousedFeature, getOrderedFieldKeys, getFields, getFeatureType, FEATURE_TYPE_BUSINESS, FEATURE_TYPE_REGION } from '../../redux/feature'

import { round } from '../../utilities'

/**
 * Renders the tooltip showing data about a specific feature when that feature is moused over
 */
function MapTooltip(props) {
  return props.mousedFeature !== undefined && (
    <div id="tooltip">
      <table>
        <thead>
          {props.featureType === FEATURE_TYPE_REGION && 
            <tr>
              <td>Zipcode:</td>
              <td>{props.mousedFeature.region}</td>
            </tr>
          }
          {props.featureType === FEATURE_TYPE_BUSINESS && 
            <tr>
              <td>Business:</td>
              <td>{props.mousedFeature.name}</td>
            </tr>
          }
	      </thead>
        <tbody>
	        {props.orderedFieldKeys.map(field => (
	          <tr key={props.field}>
	            <td>{props.fields[field].userReadableName}</td>
	            <td>{round(props.mousedFeature[field], 1)}</td>
	          </tr>
	        ))}
	    </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = state => ({
  featureType: getFeatureType(getFeatureState(state)),
  mousedFeature: getMousedFeature(getFeatureState(state)),
  orderedFieldKeys: getOrderedFieldKeys(getFeatureState(state)),
  fields: getFields(getFeatureState(state))
})

export default connect(mapStateToProps)(MapTooltip)