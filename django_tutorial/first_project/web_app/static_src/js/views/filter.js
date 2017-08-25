import {getFilterField, setFilterField, getFilterRange, getFieldExtent} from '../redux/filter'
import {fields, getOrderedFields, round} from '../utilities'



var initializedFilterControls = false

export default function renderFilterControls(state, dispatch) {

  if(!initializedFilterControls) {
    initializedFilterControls = true

    let filterSelectBox = $('#filter-select')

    getOrderedFields().forEach(key => {
      filterSelectBox.append($('<option>', {
        text: fields[key].userReadableName,
        value: key,
        selected: key == getFilterField(state)
      }))
    })

    filterSelectBox.change(() => {
      let filterField = filterSelectBox.find(':selected').prop('value')
      dispatch(setFilterField(filterField))
    });

    $('#filter-slider').slider({
      range: true,
      slide(event, ui) {
        let newFilterRange = ui.values.slice()
        dispatch(setFilterRange(newFilterRange))
      },
      // dummy values
      min: 0,
      max: 1,
      step: 0.1,
      values: [0, 1]
    })
  }


  const filterRange = getFilterRange(state)
  const fieldExtent = getFieldExtent(state)

  $('#filter-min').text(round(filterRange[0], 1))
  $('#filter-max').text(round(filterRange[1], 1))

  $('#filter-slider').slider({
    min: fieldExtent[0],
    max: fieldExtent[1],
    step: (fieldExtent[1] - fieldExtent[0]) / 100,
    values: fieldExtent.slice()
  })
}

