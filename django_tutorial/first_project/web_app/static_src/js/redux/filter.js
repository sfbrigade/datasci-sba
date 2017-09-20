import { getFeatures, SET_DISTRICT_REGION_TYPE_AND_FEATURES, isValidField, getOrderedFieldKeys } from './feature'


/*
 * Note that the filter controller uses a 'slice' of the global state, i.e. the state
 * we deal with here is stored in the 'filter' field of the global state, or in other
 * words, stateFromThisFile === globalState.filter.
 */



////////////////// Initial State //////////////////////


const initialState = {
  filterField: 'sba_per_small_bus',
  filterRange: [0, 1]
}



////////////////// State Selectors //////////////////////

export const getFilterField        = (state) => state.filterField
export const getFilterRange        = (state) => state.filterRange




/**
 * @param {Object} featureState
 * @param {String} field
 * @return {number[]} array of length 2, containing min and max values of the given field
 * across all features
 */
export function getFieldExtent(featureState, field) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  let hasData = false

  if(featureState) {
    Object.values(getFeatures(featureState)).forEach(feature => {
      if(feature[field] != null && !isNaN(feature[field])) {
        min = Math.min(min, feature[field])
        max = Math.max(max, feature[field])
        hasData = true
      }
    })
  }
  return hasData ? [min, max] : [0, 1]
}



////////////////// Action Creators //////////////////////

export const SET_FILTER_FIELD = 'SET_FILTER_FIELD'
export const SET_FILTER_RANGE = 'SET_FILTER_RANGE'

export function setFilterField(filterField) {
  return {type: SET_FILTER_FIELD, filterField}
}

export function setFilterRange(filterRange) {
  return {type: SET_FILTER_RANGE, filterRange}
}


////////////////// Reducers //////////////////////


/**
 * Note that unlike a normal reducer, this reducer also accepts an optional featureState
 * param since the filter state depends on the feature state
 */
export default function filterReducer(state=initialState, action={}, featureState) {
  let {type,
    filterField=getFilterField(state),
    filterRange} = action
  switch(type) {
    case SET_FILTER_FIELD:
    case SET_DISTRICT_REGION_TYPE_AND_FEATURES:
      if(!isValidField(featureState, filterField)) {
        filterField = getOrderedFieldKeys(featureState)[0]
      }
      return {
        ...state,
        filterField,
        filterRange: getFieldExtent(featureState, filterField)
      }

    case SET_FILTER_RANGE:
      return {
        ...state,
        filterRange
      }

    default: return state
  }
}
