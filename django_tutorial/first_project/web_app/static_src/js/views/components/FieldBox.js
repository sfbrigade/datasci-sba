import React from 'react'

import {fields, getOrderedFields} from '../../utilities'

/**
 * React component that presents a dropdown with the predefined field choices
 */
export default function FieldBox(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <select value={props.value} onChange={e => props.onChange(e.target.value)}>
        {getOrderedFields().map( key => <option value={key} key={key}>{fields[key].userReadableName}</option> )}
      </select>
    </div>
  )
}