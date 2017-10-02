import React from 'react'
import {connect} from 'react-redux'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

export default class MetricsTableSection extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      numRows: 10,
      sortBy: 'google_rating',
      fixedHeader: true,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: true,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: '300px',
    }

    this.comparator = (a, b) => {
      if(a[this.state.sortBy] < b[this.state.sortBy])
        return 1
      else if(a[this.state.sortBy] > b[this.state.sortBy])
        return -1
      else
        return 0
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e);
    if (!isNaN(e.target.textContent)) {
      const numRows = parseInt(e.target.textContent);
      this.setState({ numRows: numRows });
    } else if (e.target.textContent === 'Google Rating') {
      this.setState({ sortBy: 'google_rating' });
    } else if (e.target.textContent === 'Jobs Supported') {
      this.setState({ sortBy: 'jobs_supported' });
    }

  }

  render() {
    let businesses = Object.values(this.props.filteredBusinesses)
    businesses.sort(this.comparator)
    businesses = businesses.slice(0, this.state.numRows)

    return (
      <div className="metrics-section metrics-table">
      <CardHeader>Table of Businesses</CardHeader>
        <div className="metrics-table-filter">
          <span>View top</span>

          <SelectField value={this.state.numRows} title="numRows" name="numRows" onChange={this.handleChange} style={{width: '5em'}} >
            {[5, 10, 20, 100].map(numRows =>
              <MenuItem value={numRows} key={numRows} name="numRows" title={numRows} primaryText={numRows} />
            )}
          </SelectField>

          <span>businesses ranked by</span>

          <SelectField value={this.state.sortBy} name="sortBy" onChange={this.handleChange} style={{width: '12em'}} >
            <MenuItem value="jobs_supported" primaryText="Jobs Supported" />
            <MenuItem value="google_rating" primaryText="Google Rating" />
          </SelectField>

        </div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn>Rank</TableHeaderColumn>
              <TableHeaderColumn>Business</TableHeaderColumn>
              <TableHeaderColumn>Jobs Supported</TableHeaderColumn>
              <TableHeaderColumn>Google Rating</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {businesses.map((business, index) => (
              <TableRow key={index}>
                <TableRowColumn>{index + 1}</TableRowColumn>
                <TableRowColumn>{business.borr_name}</TableRowColumn>
                <TableRowColumn>{business.jobs_supported}</TableRowColumn>
                <TableRowColumn>{business.google_rating}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
