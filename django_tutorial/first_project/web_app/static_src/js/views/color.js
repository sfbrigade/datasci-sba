import {getColorField, setColorField} from '../redux/color'
import {fields, getOrderedFields} from '../utilities'

var initializedColorControls = false


export default function renderColorControls(state, dispatch) {
  if(!initializedColorControls) {
    initializedColorControls = true

    let colorSelectBox = $('#color-select');

    getOrderedFields().forEach(key => {
      colorSelectBox.append($('<option>', {
        text: fields[key].userReadableName,
        value: key,
        selected: key == getColorField(state)
      }))
    })

    colorSelectBox.change(() => {
      let newColorField = colorSelectBox.find(':selected').prop('value')
      dispatch(setColorField(newColorField))
    });
  }
}
