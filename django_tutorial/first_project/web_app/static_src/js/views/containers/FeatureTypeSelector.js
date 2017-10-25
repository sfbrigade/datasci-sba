import React from 'react'
import {connect} from 'react-redux'

import { getFeatureState } from '../../redux/root'
import { getFeatureType, setFeatureType, FEATURE_TYPE_BUSINESS, FEATURE_TYPE_REGION } from '../../redux/feature'


/**
 * React container showing a dropdown to choose between showing regions and businesses
 */
function FeatureTypeSelector(props) {
  return (
    <div>
      <select value={props.featureType} onChange={e => props.onChange(e.target.value)}>
        <option value={FEATURE_TYPE_REGION} key={FEATURE_TYPE_REGION}>Regions</option>
        <option value={FEATURE_TYPE_BUSINESS} key={FEATURE_TYPE_BUSINESS}>Businesses</option>
      </select>
    </div>
  )
}


const mapStateToProps = state => ({
  featureState: getFeatureState(state),
  featureType: getFeatureType(getFeatureState(state))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps,
  onChange: value => {
    dispatchProps.dispatch(setFeatureType(value, stateProps.featureState))
  }
})

export default connect(mapStateToProps, null, mergeProps)(FeatureTypeSelector)

