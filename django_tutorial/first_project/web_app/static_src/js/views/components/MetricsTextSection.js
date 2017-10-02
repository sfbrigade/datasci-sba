import React from 'react'
import {connect} from 'react-redux'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import FontIcon from 'material-ui/FontIcon'

const iconStyles = {
  margin: '0',
  fontSize: '60px',
  color: '#2396F3'
};


export default function MetricsTextSection(props) {
  let filteredBusinessesAsArray = Object.values(props.filteredBusinesses)
  let numBusinesses = filteredBusinessesAsArray.length.toLocaleString();
  let numEmployees = filteredBusinessesAsArray.reduce((total, business) => business.jobs_supported + total, 0).toLocaleString();
  let capitalDelivered = filteredBusinessesAsArray.reduce((total, business) => business.gross_approval + total, 0).toLocaleString();

  return (
    <Card className="metrics-section metrics-text">
      <CardHeader title="Metrics"></CardHeader>
      <CardText className="metrics-text-container">

      <div className="metrics-text-icon-container">
        <p>Loans</p>
        <FontIcon className="material-icons" style={iconStyles}>
          account_balance
        </FontIcon>
        <h2>{numBusinesses}</h2>
      </div>

        <div className="metrics-text-icon-container">
          <p>Capital</p>
          <FontIcon className="material-icons" style={iconStyles} >
            attach_money
          </FontIcon>
          <h2>${capitalDelivered}</h2>
        </div>

        <div className="metrics-text-icon-container">
          <p>Jobs</p>
          <FontIcon className="material-icons" style={iconStyles}>
            work
          </FontIcon>
          <h2>{numEmployees}</h2>
        </div>

      </CardText>
    </Card>
  )
}

