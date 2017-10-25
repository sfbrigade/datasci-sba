import featureReducer from './feature'
import colorReducer from './color'
import filterReducer, {filterSelectors as fs} from './filter'


/*
 * This represents the root controller which is a composition of
 * the controllers for the color, filter, and features
 */


 ////////////////// Initial State //////////////////////


// since the root reducer combines the initial states of its 3 children, we don't
// actually need to populate the whole initialState here, in fact we could just
// use {}, but we include the key of each state slice so it's easier for devs
// to understand
const initialState = {
  feature: undefined, // will be populated with initial state from feature.js
  color: undefined, // will be populated with initial state from color.js
  filter: undefined // will be populated with initial state from filter.js
}


////////////////// State Selectors //////////////////////

// the root store is composed of 3 fields each of which corresponds
// to its own redux actions/reducer

export const getFeatureState    = state => state.feature
export const getFilterState     = state => state.filter
export const getColorState      = state => state.color


////////////////// Actions //////////////////////

// no actions needed in the root





////////////////// Reducers //////////////////////


export default function rootReducer(state=initialState, action={}) {
  // the feature, color, and filter components are almost independent of each other,
  // except that color and filter depend on the feature data.  Thus instead of just
  // using combineReducers like we would if they were independent, we instead run
  // the feature reducer first, and then pass the feature state as an argument to
  // the color and filter reducers

  state = {
    ...state,
    feature: featureReducer(getFeatureState(state), action)
  }

  state = {
    ...state,
    color: colorReducer(getColorState(state), action, getFeatureState(state)),
    filter: filterReducer(getFilterState(state), action, getFeatureState(state))
  }

  return state
}