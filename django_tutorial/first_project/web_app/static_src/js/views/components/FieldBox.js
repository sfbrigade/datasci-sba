import React from 'react'

import {fields, getOrderedFields} from '../../utilities'

export default function FieldBox(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <select value={props.value} onChange={props.onChange}>
        {getOrderedFields().map( key => <option value={key} key={key}>{fields[key].userReadableName}</option> )}
      </select>
    </div>
  )
}