import regionReducer from './regions'
import colorReducer from './color'
import filterReducer, {filterSelectors as fs} from './filter'


/*
 * This represents the root controller which is a composition of
 * the controllers for the color, filter, and regions
 */


 ////////////////// Initial State //////////////////////


// since the root reducer combines the initial states of its 3 children, we don't
// actually need to define an initialState for the root; this is included just so
// you can understand the shape of the state
const initialState = {
  region: {/* initial state from region.js */},
  color: {/* initial state from color.js */},
  filter: {/* initial state from filter.js */},
}


////////////////// State Selectors //////////////////////

// the root store is composed of 3 fields each of which corresponds
// to its own redux actions/reducer

export const getRegionState     = state => state.region
export const getFilterState     = state => state.filter
export const getColorState      = state => state.color


////////////////// Actions //////////////////////

// no actions needed in the root





////////////////// Reducers //////////////////////


export default function rootReducer(state, action) {
  // the region, color, and filter components are almost independent of each other,
  // except that color and filter depend on the region data.  Thus instead of just
  // using combineReducers like we would if they were independent, we instead run
  // the region reducer first, and then pass the region state as an argument to
  // the color and filter reducers

  state = {
    ...state,
    region: regionReducer(getRegionState(state), action)
  }

  state = {
    ...state,
    color: colorReducer(getColorState(state), action, getRegionState(state)),
    filter: filterReducer(getFilterState(state), action, getRegionState(state))
  }

  return state
}