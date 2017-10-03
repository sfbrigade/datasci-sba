import React from 'react'
import {connect} from 'react-redux'

import MetricsFilters from '../components/MetricsFilters'
import MetricsTextSection from '../components/MetricsTextSection'
import MetricsTableSection from '../components/MetricsTableSection'
import MetricsMapSection from '../components/MetricsMapSection'
import MetricsVisualizationSection from '../components/MetricsVisualizationSection'

import { getFeatureState } from '../../redux/root'
import { getAvailableRegionsByRegionType, getSelectedRegionType, getSelectedRegion, getSelectedYear,
  REGION_TYPE_ZIP, REGION_TYPE_CITY, REGION_TYPE_COUNTY, REGION_TYPE_CONGRESSIONAL_DISTRICT,
  setMetricsFilters, getFilteredBusinesses } from '../../redux/feature'



/**
 * React container powering the contents of the Metrics tab, with a component at the top to filter businesses,
 * and a grid of components at the bottom to show some data about those businesses.
 *
 * Functions as a controlled component for the 3 filtering dropdowns, ie we keep the current state of the 3
 * dropdowns in this.state.  We maintain this state separately from the redux state because we allow the
 * user to update the dropdowns while NOT immediately updating the data below, since they need to hit the "Submit"
 * button first.
 *
 * Note that when the 'regionType' dropdown changes, or props.availableRegionsByRegionType changes,
 * this affects the set of options in the 'regions' dropdown and we need to update the state.selectedRegion accordingly
 * to keep it in sync with the 'regions' dropdown.
 */
class Metrics extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedRegionType: props.selectedRegionType,
      selectedYear: props.selectedYear,
      selectedRegion: props.selectedRegion || props.availableRegionsByRegionType[props.selectedRegionType][0],
      hasSubmitted: false	// tells whether the user has hit the "submit" button at all, to avoid showing "no results" msg on page load
    }

    this.availableRegionTypes = {
      [REGION_TYPE_ZIP]: 'ZIP Code',
      [REGION_TYPE_CITY]: 'City',
      [REGION_TYPE_COUNTY]: 'County',
      [REGION_TYPE_CONGRESSIONAL_DISTRICT]: 'Congressional District'
    }
    this.availableYears = [5, 10, 15, 20, 25]
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.availableRegionsByRegionType !== this.props.availableRegionsByRegionType) {
      this.setState({selectedRegion: nextProps.availableRegionsByRegionType[this.state.selectedRegionType][0]});
    }
  }

  handleChange(name, value) {
    let partialState = {[name]: value}
    if(name == 'selectedRegionType') {
      partialState.selectedRegion = this.props.availableRegionsByRegionType[value][0]
    }
    this.setState(partialState)
  }

  handleSubmit() {
  	this.setState({hasSubmitted: true})
    this.props.setMetricsFilters(this.state)
  }

  render() {
    return (
      <div className="metrics">
        <MetricsFilters
          availableRegionTypes={this.availableRegionTypes}
          selectedRegionType={this.state.selectedRegionType}
          availableRegions={this.props.availableRegionsByRegionType[this.state.selectedRegionType]}
          selectedRegion={this.state.selectedRegion}
          availableYears={this.availableYears}
          selectedYear={this.state.selectedYear}
          onChange={(name, value) => this.handleChange(name, value)}
          onSubmit={() => this.handleSubmit()}
        />

        {Object.keys(this.props.filteredBusinesses).length > 0 &&
          <div className="metrics-section-container">
            <MetricsTextSection
              selectedRegionType={this.props.selectedRegionType}
              selectedRegion={this.props.selectedRegion}
              selectedYear={this.props.selectedYear}
              filteredBusinesses={this.props.filteredBusinesses}/>
            <MetricsVisualizationSection
              filteredBusinesses={this.props.filteredBusinesses}/>
            <MetricsTableSection
              filteredBusinesses={this.props.filteredBusinesses}/>
            <MetricsMapSection
              filteredBusinesses={this.props.filteredBusinesses}/>
          </div>
        }

        {Object.keys(this.props.filteredBusinesses).length == 0 && this.state.hasSubmitted &&
          <div>No SBA loans found matching your criteria</div>
        }
      </div>
    )
  }
}



const mapStateToProps = state => ({
  availableRegionsByRegionType: getAvailableRegionsByRegionType(getFeatureState(state)),
  selectedRegionType: getSelectedRegionType(getFeatureState(state)),
  selectedRegion: getSelectedRegion(getFeatureState(state)),
  selectedYear: getSelectedYear(getFeatureState(state)),
  filteredBusinesses: getFilteredBusinesses(getFeatureState(state))
})

const mapDispatchToProps = {
  setMetricsFilters
}

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)

