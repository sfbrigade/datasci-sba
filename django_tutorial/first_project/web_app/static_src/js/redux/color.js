import {getRegions} from './regions'
import {Quantiler} from '../utilities'


////////////////// State Selectors //////////////////////


export const getColorField         = (state) => state.ui.color.colorField
export const getNumColorQuantiles  = (state) => state.ui.color.numQuantiles
export const getColorQuantiler     = (state) => state.ui.color.colorQuantiler


////////////////// Action Creators //////////////////////

export function setColorField(colorField) {
  return {type: 'SET_COLOR_FIELD', colorField}
}


////////////////// Reducers //////////////////////

export default function colorReducer(state, action) {
  const {type, colorField=getColorField(state)} = action
  switch(type) {
    case 'SET_COLOR_FIELD':
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        ui: Object.assign({}, state.ui, {
          color: {
            numQuantiles: getNumColorQuantiles(state),
            colorField,
            colorQuantiler: new Quantiler(
              Object.values(getRegions(state)).map(region => region[colorField]),
              getNumColorQuantiles(state))
          }
        })
      })

    default: return state
  }
}