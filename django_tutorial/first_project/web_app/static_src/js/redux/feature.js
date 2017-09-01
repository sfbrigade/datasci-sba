import * as api from '../api'

import {fields} from '../utilities'


/*
 * Note that the features controller uses a 'slice' of the global state, i.e. the state
 * we deal with here is stored in the 'feature' field of the global state, or in other
 * words, stateFromThisFile === globalState.feature.
 */



////////////////// Initial State //////////////////////


const initialState = {
  features: {
    // will be filled in with SBA feature data from server
  },
  geometry: {
    // will be filled in with geo data from server
  },
  districts: {
    'SFDO': {
      userReadableName: 'San Francisco'
    }
  },
  regionTypes: {
    'zip': {
      userReadableName: 'ZIP Code'
    }
  },
  selectedDistrict: 'SFDO',
  selectedRegionType: 'zip',
  mousedFeatureId: undefined
}




////////////////// State Selectors //////////////////////


export const getFeatures           = state => state.features
export const getGeometry           = state => state.geometry
export const getSelectedDistrict   = state => state.selectedDistrict
export const getSelectedRegionType = state => state.selectedRegionType
export const getMousedFeature      = state => state.features[state.mousedFeatureId]





////////////////// Actions //////////////////////

export const SET_MOUSED_FEATURE = 'SET_MOUSED_FEATURE'
export const SET_DISTRICT_REGION_TYPE_AND_FEATURES = 'SET_DISTRICT_REGION_TYPE_AND_FEATURES'

export function setMousedFeatureId(mousedFeatureId) {
	return {type: SET_MOUSED_FEATURE, mousedFeatureId}
}

export function fetchFeatures(state) {
  return setDistrictAndRegionType({
    selectedDistrict: getSelectedDistrict(state),
    selectedRegionType: getSelectedRegionType(state)
  })
}

export function setDistrictAndRegionType({selectedDistrict, selectedRegionType}) {
  // This is a slightly more complicated action.  It uses Thunk middleware
  // so returns a function instead of an action object.  We do this so the
  // function can fetch data asynchronously from the server, and then dispatch
  // an action that contains the full geometry and feature data from the server
  return (dispatch) => {  

    // fire off 2 ajax requests: one for the region GeoJSON data, and one for the SBA loan data
    let regionGeometryPromise = api.getGeometry()
    let sbaDataPromise = api.getRegions()

    // once both requests have returned...
    return Promise.all([sbaDataPromise, regionGeometryPromise])
      .then(([sbaData, geometry]) => {

        // convert the SBA data from an array of regions to a map from region code (eg zip) to region data, for easy
        // lookup by region code
        let features = {}
        sbaData.data.forEach(sbaDatum => {
          // HACK: API currently returns string values for fields that are numeric in the PG DB;
          // convert them to numbers now, but ideally the API would return numbers not strings
          Object.keys(fields).forEach(field => {
            sbaDatum[field] = parseFloat(sbaDatum[field])
          })

          // HACK: remove a couple spurious data points from the set to get better looking histograms.
          // TODO: we should be cleaning the data in the pipeline
          sbaDatum.sba_per_small_bus = Math.min(1, sbaDatum.sba_per_small_bus)
          
          features[sbaDatum.region] = sbaDatum

        })

        // dispatch an action that will set the actual geometry & region data on the state
        dispatch(setDistrictRegionTypeAndFeatures({selectedDistrict, selectedRegionType, geometry, features}))

      })

  // TODO error handling if either request failed
   
  }
}

export function setDistrictRegionTypeAndFeatures({selectedDistrict, selectedRegionType, geometry, features}) {
  return {
    type: SET_DISTRICT_REGION_TYPE_AND_FEATURES,
    selectedDistrict,
    selectedRegionType,
    geometry,
    features
  }
}


////////////////// Reducers //////////////////////


export default function featureReducer(state=initialState, action={}) {
  const {type, selectedDistrict, selectedRegionType, geometry, features, mousedFeatureId} = action
  switch(type) {
    case SET_DISTRICT_REGION_TYPE_AND_FEATURES:
      return {
        ...state,
        geometry,
        features,
        selectedDistrict,
        selectedRegionType
      }

    case SET_MOUSED_FEATURE:
      return {
        ...state,
        mousedFeatureId
      }

    default: return state
  }
}