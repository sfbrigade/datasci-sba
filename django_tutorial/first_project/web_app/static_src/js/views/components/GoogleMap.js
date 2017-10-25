import React from 'react'
import { connect } from 'react-redux'

import 'js-marker-clusterer'

import {getFeatureState, getFilterState, getColorState} from '../../redux/root'
import {getGeometry, getFeatures, setMousedFeatureId, FEATURE_TYPE_REGION, FEATURE_TYPE_BUSINESS, getFeatureType } from '../../redux/feature'
import {getColorField, getColorQuantiler, getNumColorQuantiles} from '../../redux/color'
import {getFilterField, getFilterRange} from '../../redux/filter'

import { calculateColor } from '../../utilities'


/**
 * React component that renders the map with colored features.  Basically a wrapper around the GoogleMap API.
 * 
 * We don't really use React's lifecycle here; instead we depend on GoogleMap's internal update cycle.
 * Thus our React render method is just a div, and the real work happens in componentDidMount (for
 * initialization) and componentDidUpdate (to do the rendering when the state has changed)
 */
export default class GoogleMap extends React.Component {

  /**
   * called by React after the DOM element is first added to the page; we use this to
   * initialize the Google Map insteance
   */
  componentDidMount() {
    this.map = new google.maps.Map(document.getElementById('map'), googleMapOptions);

    this.map.data.setStyle(feature => styleFeature(feature, this.props))
    this.map.data.addListener('mouseover', e => {
      e.feature.setProperty('state', 'hover')
      this.props.onMouseover(e.feature.getId())
    })
    this.map.data.addListener('mouseout', e => {
      e.feature.setProperty('state', 'normal')
      this.props.onMouseover(undefined)
    })

    this.markers = []
    this.markerClusterer = new MarkerClusterer(this.map, [],
      // TODO: don't hotlink google's images, and we should probably create our own that look better
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})

    this.internalRender({})
  }

  componentDidUpdate(prevProps) {
    this.internalRender(prevProps)
  }


  /**
   * Since we're not tying into React's normal render cycle, we need to call internalRender after each mount
   * or update, to update the GoogleMap.
   */
  internalRender(prevProps) {

    // for performance reasons, only update the features' geometry if it has changed
    if(prevProps.geometry !== this.props.geometry || prevProps.featureType !== this.props.featureType
        || prevProps.features !== this.props.features) {
      this.map.data.forEach((feature) => this.map.data.remove(feature))
      this.markers.forEach(marker => marker.setMap(null))
      this.markers.length = 0

      switch(this.props.featureType) {
        case FEATURE_TYPE_REGION:
          if(this.props.geometry != null) { 
            this.map.data.addGeoJson(this.props.geometry, { idPropertyName: 'GEOID10' })
          }
          break;

        case FEATURE_TYPE_BUSINESS:
          for(let id in this.props.features) {
            let feature = this.props.features[id]
            if(feature.latitude && feature.longitude) {
              let marker = new google.maps.Marker({
                map: this.props.useClusterer ? undefined : this.map,
                position: {lat: feature.latitude, lng: feature.longitude},
                clickable: true,

                businessId: id
              })
              marker.addListener('mouseover', this.createMouseoverListener(feature))
              marker.addListener('mouseout', this.createMouseoutListener(feature))
              this.markers.push(marker)
            }
          }

          break;

        default:
          break;
      }
    }

    if(prevProps.features !== this.props.features
      || prevProps.colorField !== this.props.colorField
      || prevProps.filterField !== this.props.filterField
      || prevProps.filterRange !== this.props.filterRange
      || prevProps.useClusterer !== this.props.useClusterer
      || prevProps.useFilter !== this.props.useFilter) {


      // update all map features (eg zip code regions)
      this.map.data.forEach((mapFeature) => {

        let dataFeature = this.props.features[mapFeature.getId()]
        if(dataFeature) {
          const colorVariable = dataFeature[this.props.colorField]
          const filterVariable = dataFeature[this.props.filterField]

          if(this.props.filterRange[0] <= filterVariable && filterVariable <= this.props.filterRange[1]) {
            mapFeature.setProperty('colorVariable', colorVariable);    
          } else {
            mapFeature.setProperty('colorVariable', undefined)
          }
        }
      })

      // TODO: we're currently clearing and re-adding all markers; there is probably a more efficient way to do this
      this.markerClusterer.clearMarkers()
      if(this.props.useClusterer) {
        this.markerClusterer.addMarkers(this.markers.filter(marker => {
          let feature = this.props.features[marker.get('businessId')]
          return this.isVisible(feature)
        }))
      } else {
        this.markers.forEach(marker => {
          let id = marker.get('businessId')
          let feature = this.props.features[id]
          marker.setVisible(this.isVisible(feature))
        })
      }
    }

  }

  isVisible(feature) {
    return feature != null
      && (!this.props.useFilter || (this.props.filterRange[0] <= feature[this.props.filterField] && feature[this.props.filterField] <= this.props.filterRange[1]))
  }

  createMouseoverListener(feature) {
    return () => this.props.onMouseover(feature.id)
  }

  createMouseoutListener(feature) {
    return () => this.props.onMouseover(undefined)
  }


  render() {
    return <div id="map"/>
  }
}








/////////////////////// Supporting styles/options for Google Maps API //////////////////////////

/*
 * These are some constants used by the GoogleMaps component above to style the map
 */


/**
 * Applies a gradient style based on the colorField.
 * This is the callback passed to data.setStyle() and is called for each row in
 * the data set.  Check out the docs for Data.StylingFunction.
 *
 * @param {google.maps.Data.Feature} feature
 * @param {Object} props the current props on the GoogleMap component
 */
function styleFeature(feature, props) {

  // determine whether to show this shape or not
  var showRow = true;
  if (feature.getProperty('colorVariable') == null ||
      isNaN(feature.getProperty('colorVariable'))) {
    showRow = false;
  }

  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: calculateColor(feature.getProperty('colorVariable'), props.colorQuantiler),
    fillOpacity: 0.75,
    visible: showRow
  };
}


const googleMapOptions = {
  center: {lat: 40, lng: -123},
  zoom: 7,
  styles: [{
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'road',
      'stylers': [{'visibility': 'on'}]
    }, {
      'featureType': 'administrative',
      'stylers': [{'visibility': 'on'}]
    }, {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [{'visibility': 'simplified'}]
    }
  ]
}