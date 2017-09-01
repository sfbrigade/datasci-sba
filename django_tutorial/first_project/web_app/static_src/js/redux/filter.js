import { getRegions, SET_DISTRICT_REGION_TYPE_AND_REGIONS } from './regions'


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
 * @param {Object} regionState
 * @param {String} field
 * @return {number[]} array of length 2, containing min and max values of the given field
 * across all regions
 */
export function getFieldExtent(regionState, field) {
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  let hasData = false

  if(regionState) {
    Object.values(getRegions(regionState)).forEach(region => {
      if(region[field] != null && !isNaN(region[field])) {
        min = Math.min(min, region[field])
        max = Math.max(max, region[field])
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
 * Note that unlike a normal reducer, this reducer also accepts an optional regionState
 * param since the filter state depends on the region state
 */
export default function filterReducer(state=initialState, action={}, regionState) {
  const {type,
    filterField=getFilterField(state),
    filterRange} = action
  switch(type) {
    case SET_FILTER_FIELD:
    case SET_DISTRICT_REGION_TYPE_AND_REGIONS:
      return {
        ...state,
        filterField,
        filterRange: getFieldExtent(regionState, filterField)
      }

    case SET_FILTER_RANGE:
      return {
        ...state,
        filterRange
      }

    default: return state
  }
}
