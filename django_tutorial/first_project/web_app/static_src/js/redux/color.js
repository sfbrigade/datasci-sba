import {getRegions} from './regions'
import {Quantiler} from '../utilities'

/*
 * Note that the color controller uses a 'slice' of the global state, i.e. the state
 * we deal with here is stored in the 'color' field of the global state, or in other
 * words, stateFromThisFile === globalState.color.
 */


 ////////////////// Initial State //////////////////////


const initialState = {
  colorField: 'sba_per_small_bus',
  colorQuantiler: undefined,
  numQuantiles: 10
}



////////////////// State Selectors //////////////////////


export const getColorField         = (state) => state.colorField
export const getNumColorQuantiles  = (state) => state.numQuantiles
export const getColorQuantiler     = (state) => state.colorQuantiler


////////////////// Action Creators //////////////////////

export function setColorField(colorField) {
  return {type: 'SET_COLOR_FIELD', colorField}
}


////////////////// Reducers //////////////////////

/**
 * Note that unlike a normal reducer, this reducer also accepts an optional regionState
 * param since the color quantiler state depends on the region state
 */
export default function colorReducer(state=initialState, action={}, regionState) {
  const {type, colorField=getColorField(state)} = action
  switch(type) {
    case 'SET_COLOR_FIELD':
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      const regions = regionState===undefined ? [] : Object.values(getRegions(regionState))
      return {
        ...state,
        colorField,
        colorQuantiler: new Quantiler(
          regions.map(region => region[colorField]),
          getNumColorQuantiles(state))
      }

    default: return state
  }
}