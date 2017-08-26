import {getRegions} from './regions'


////////////////// State Selectors //////////////////////

export const getFilterField        = (state) => state.ui.filter.filterField
export const getFilterRange        = (state) => state.ui.filter.filterRange




/**
 * @param {Object} state
 * @param {String} field if undefined, defaults to currently selected filter field in state
 * @return {number[]} array of length 2, containing min and max values of the given field
 * across all regions
 */
export function getFieldExtent(state, field) {
  if(field === undefined) {
    field = getFilterField(state)
  }
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE
  let hasData = false

  Object.values(getRegions(state)).forEach(region => {
    if(region[field] != null && !isNaN(region[field])) {
      min = Math.min(min, region[field])
      max = Math.max(max, region[field])
      hasData = true
    }
  })
  return hasData ? [min, max] : [0, 1]
}



////////////////// Action Creators //////////////////////

export function setFilterField(filterField) {
  return {type: 'SET_FILTER_FIELD', filterField}
}

export function setFilterRange(filterRange) {
  return {type: 'SET_FILTER_RANGE', filterRange}
}



////////////////// Reducers //////////////////////

export default function filterReducer(state, action) {
  const {type,
    filterField=getFilterField(state),
    filterRange} = action
  switch(type) {
    case 'SET_FILTER_FIELD':
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          filter: {
            filterField,
            filterRange: getFieldExtent(state, filterField)
          }
        })
      })

    case 'SET_FILTER_RANGE':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          filter: {
            filterField,
            filterRange: filterRange
          }
        })
      })

    default: return state
  }
}
