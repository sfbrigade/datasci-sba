import * as api from '../api'


/*
 * Note that the features controller uses a 'slice' of the global state, i.e. the state
 * we deal with here is stored in the 'feature' field of the global state, or in other
 * words, stateFromThisFile === globalState.feature.
 */



////////////////// Initial State //////////////////////

export const FEATURE_TYPE_BUSINESS = 'business'
export const FEATURE_TYPE_REGION = 'region'

const initialState = {
  featureType: FEATURE_TYPE_REGION,
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
  mousedFeatureId: undefined,
  fields: {
    [FEATURE_TYPE_REGION]: {
      'sba_per_small_bus': {
        userReadableName: 'Total SBA Loans per Small Business'
      },
      'loan_504_per_small_bus': {
        userReadableName: '504 Loans per Small Biz'
      },
      'loan_7a_per_small_bus': {
        userReadableName: '7a Loans per Small Biz'
      },
      'mean_agi': {
        userReadableName: 'Mean AGI'
      },
      'total_7a': {
        userReadableName: 'Total 7a Loans'
      },
      'total_504': {
        userReadableName: 'Total 504 Loans'
      },
      'total_sba': {
        userReadableName: 'Total SBA Loans'
      },
      'total_small_bus': {
        userReadableName: 'Total Small Businesses'
      }
    },
    [FEATURE_TYPE_BUSINESS]: {
      'google_rating': {
        userReadableName: 'Google Rating'
      }
    }
  }
}




////////////////// State Selectors //////////////////////


export const getFeatureType        = state => state.featureType
export const getFeatures           = state => state.features
export const getGeometry           = state => state.geometry
export const getSelectedDistrict   = state => state.selectedDistrict
export const getSelectedRegionType = state => state.selectedRegionType
export const getMousedFeature      = state => state.features[state.mousedFeatureId]
export const getFields             = state => state.fields[state.featureType]

export const getOrderedFieldKeys   = state => {
  // TODO: cache with reselect
  let fields = getFields(state)
  let orderedFields = Object.keys(fields)
  orderedFields.sort((a, b) => fields[a].userReadableName > fields[b].userReadableName)
  return orderedFields
}


export const isValidField         = (state, field) => getFields(state)[field] !== undefined




////////////////// Actions //////////////////////

export const SET_MOUSED_FEATURE = 'SET_MOUSED_FEATURE'
export const SET_DISTRICT_REGION_TYPE_AND_FEATURES = 'SET_DISTRICT_REGION_TYPE_AND_FEATURES'

export function setMousedFeatureId(mousedFeatureId) {
	return {type: SET_MOUSED_FEATURE, mousedFeatureId}
}

export function fetchFeatures(state) {
  return setDistrictAndRegionType({
    featureType: getFeatureType(state),
    selectedDistrict: getSelectedDistrict(state),
    selectedRegionType: getSelectedRegionType(state)
  })
}

export function setFeatureType(featureType, state) {
  return setDistrictAndRegionType({
    featureType: featureType,
    selectedDistrict: getSelectedDistrict(state),
    selectedRegionType: getSelectedRegionType(state)
  })
}

export function setDistrictAndRegionType({featureType, selectedDistrict, selectedRegionType}) {
  // This is a slightly more complicated action.  It uses Thunk middleware
  // so returns a function instead of an action object.  We do this so the
  // function can fetch data asynchronously from the server, and then dispatch
  // an action that contains the full geometry and feature data from the server
  return dispatch => {

    const promises = []

    // fire off 2 ajax requests: one for the region GeoJSON data, and one for the SBA loan data
    promises.push(featureType === FEATURE_TYPE_BUSINESS ? api.getBusinesses() : api.getRegions())
    if(featureType == FEATURE_TYPE_REGION) {
      promises.push(api.getGeometry())
    }
    

    // once both requests have returned...
    return Promise.all(promises)
      .then(([sbaData, geometry]) => {

        // convert the SBA data from an array of regions to a map from region code (eg zip) to region data, for easy
        // lookup by region code
        const features = {}
        sbaData.data.forEach(sbaDatum => {
          if(featureType === FEATURE_TYPE_REGION) {
            // HACK: API currently returns string values for fields that are numeric in the PG DB;
            // convert them to numbers now, but ideally the API would return numbers not strings
            Object.keys(initialState.fields[FEATURE_TYPE_REGION]).forEach(field => {
              sbaDatum[field] = parseFloat(sbaDatum[field])
            })

            // HACK: remove a couple spurious data points from the set to get better looking histograms.
            // TODO: we should be cleaning the data in the pipeline
            sbaDatum.sba_per_small_bus = Math.min(1, sbaDatum.sba_per_small_bus)
          }

          // normally we would store the features in a map by their 'id' field, but for the zip code visualization,
          // the geometry data is given by the zip code not the feature's 'id' field, so we store the features
          // in a map by zip code (which is in the 'region' field).
          // TODO: give the geometry logic a way to look up by feature id, instead of zip code?
          const id = featureType === FEATURE_TYPE_REGION ? 'region' : 'id'
          
          features[sbaDatum[id]] = sbaDatum

        })

        // dispatch an action that will set the actual geometry & region data on the state
        dispatch(setDistrictRegionTypeAndFeatures({selectedDistrict, selectedRegionType, geometry, features, featureType}))

      })

  // TODO error handling if either request failed
   
  }
}

export function setDistrictRegionTypeAndFeatures({featureType, selectedDistrict, selectedRegionType, geometry, features}) {
  return {
    type: SET_DISTRICT_REGION_TYPE_AND_FEATURES,
    selectedDistrict,
    selectedRegionType,
    geometry,
    features,
    featureType
  }
}


////////////////// Reducers //////////////////////


export default function featureReducer(state=initialState, action={}) {
  const {type, selectedDistrict, selectedRegionType, geometry, features, mousedFeatureId, featureType} = action
  switch(type) {
    case SET_DISTRICT_REGION_TYPE_AND_FEATURES:
      return {
        ...state,
        geometry,
        features,
        selectedDistrict,
        selectedRegionType,
        featureType
      }

    case SET_MOUSED_FEATURE:
      return {
        ...state,
        mousedFeatureId
      }

    default: return state
  }
}