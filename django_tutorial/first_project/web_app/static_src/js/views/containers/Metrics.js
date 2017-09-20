import React from 'react'
import {connect} from 'react-redux'

import MetricsFilters from '../components/MetricsFilters'
import MetricsTextSection from '../components/MetricsTextSection'

import { getFeatureState } from '../../redux/root'
import { getAvailableRegionsByRegionType, getSelectedRegionType, getSelectedRegion, getSelectedYear,
  REGION_TYPE_ZIP, REGION_TYPE_CITY, REGION_TYPE_COUNTY, REGION_TYPE_CONGRESSIONAL_DISTRICT,
  setMetricsFilters, getFilteredBusinesses } from '../../redux/feature'



/**
 * React container showing a dropdown to choose between showing regions and businesses
 */
class Metrics extends React.Component {

  constructor(props) {
  	super(props)
  	let {selectedRegion, selectedRegionType, selectedYear} = props
  	this.state = {
  		selectedRegionType,
  		selectedYear,
  		selectedRegion: selectedRegion || props.availableRegionsByRegionType[props.selectedRegionType][0]
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
  		this.setState({selectedRegion: nextProps.availableRegionsByRegionType[this.state.selectedRegionType][0]})
  	}
  	// let partialState = {}
  	// for(let field of ['selectedRegionType', 'selectedRegion', 'selectedYear']) {
  	//   if(nextProps[field] !== this.props.field)
  	//   	partialState[field] = nextProps[field]
  	// }
  	// this.setState(partialState)
  }

  handleChange(name, value) {
  	// if(name === 'selectedRegionType') {
  	// 	this.setState({
  	// 		avalilal
  	// 	})
  	// }
  	let partialState = {[name]: value}
  	if(name == 'selectedRegionType') {
  		partialState.selectedRegion = this.props.availableRegionsByRegionType[value][0]
  	}
  	this.setState(partialState)
  }

  handleSubmit() {
  	this.props.setMetricsFilters(this.state)
  }

  render() {
    return (
      <div>
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

        {this.props.filteredBusinesses.length > 0 &&
	        <MetricsTextSection
	          selectedRegionType={this.props.selectedRegionType}
	          selectedRegion={this.props.selectedRegion}
	          selectedYear={this.props.selectedYear}
	          filteredBusinesses={this.props.filteredBusinesses}/>
	    }

	    {this.props.filteredBusinesses.length == 0 &&
	    	<div>No results found</div>
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

