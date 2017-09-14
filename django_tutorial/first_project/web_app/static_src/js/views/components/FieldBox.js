import React from 'react'

/**
 * React component that presents a dropdown with the predefined field choices
 */
export default function FieldBox(props) {
  return (
    <div className="testy">
      <h2>{props.title}</h2>
      <select value={props.value} onChange={e => props.onChange(e.target.value)}>
        {props.orderedFieldKeys.map( key => <option value={key} key={key}>{props.fields[key].userReadableName}</option> )}
      </select>
    </div>
  )
}
