import React from 'react'
import {connect} from 'react-redux'
import {Card, CardHeader, CardText} from 'material-ui/Card';

export default class MetricsTableSection extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      numRows: 10,
      sortBy: 'google_rating'
    }

    this.comparator = (a, b) => {
      if(a[this.state.sortBy] < b[this.state.sortBy])
        return 1
      else if(a[this.state.sortBy] > b[this.state.sortBy])
        return -1
      else
        return 0
    }

    this.handleChange = e => this.setState({[e.target.name]: e.target.value})
  }

  render() {
    let businesses = Object.values(this.props.filteredBusinesses)
    businesses.sort(this.comparator)
    businesses = businesses.slice(0, this.state.numRows)
    return (
      <Card className="metrics-section">
        <CardHeader title="Table"></CardHeader>
        <CardText>
          <div>
            <span>View</span>
            <select value={this.state.numRows} name="numRows" onChange={this.handleChange}>
              {[5, 10, 20, 100].map(numRows =>
                <option value={numRows} key={numRows}>Top {numRows}</option>
              )}
            </select>
            <span>businesses ranked by</span>
            <select value={this.state.sortBy} name="sortBy" onChange={this.handleChange}>
              <option value="jobs_supported">Jobs Supported</option>
              <option value="google_rating">Google Rating</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Business</th>
                <th>Jobs Supported</th>
                <th>Google Rating</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business, index) => 
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{business.borr_name}</td>
                  <td>{business.jobs_supported}</td>
                  <td>{business.google_rating}</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardText>
      </Card>
    )
  }
}

