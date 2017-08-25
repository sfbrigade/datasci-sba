import {fields} from '../utilities'



////////////////// State Selectors //////////////////////


export const getRegions            = (state) => state.regions
export const getGeometry           = (state) => state.geometry
export const getSelectedDistrict   = (state) => state.ui.selectedDistrict
export const getSelectedRegionType = (state) => state.ui.selectedRegionType






////////////////// Actions //////////////////////


export function setDistrictAndRegionType({district, regionType}) {
  // This is a slightly more complicated action.  It uses Thunk middleware
  // so returns a function instead of an action object.  We do this so the
  // function can fetch data asynchronously from the server, and then dispatch
  // an action that contains the full geometry and region data from the server
  return (dispatch, getState) => {  
    if(district === undefined) {
      district = getSelectedDistrict(getState())
    }
    if(regionType === undefined) {
      regionType = getSelectedRegionType(getState())
    }

    // fire off 2 ajax requests: one for the region GeoJSON data, and one for the SBA loan data
    let regionGeometryPromise = $.ajax({
      url: window.topoUrl,
      dataType: 'json'
    })
    let sbaDataPromise = $.ajax({
      url: window.regionsUrl,
      dataType: 'json'
    })

    // once both requests have returned...
    return Promise.all([sbaDataPromise, regionGeometryPromise])
      .then(([sbaData, geometry]) => {

        // convert the SBA data from an array of regions to a map from region code (eg zip) to region data, for easy
        // lookup by region code
        let regions = {}
        sbaData.data.forEach(sbaDatum => {
          // HACK: API currently returns string values for fields that are numeric in the PG DB;
          // convert them to numbers now, but ideally the API would return numbers not strings
          Object.keys(fields).forEach(field => {
            sbaDatum[field] = parseFloat(sbaDatum[field])
          })

          regions[sbaDatum.region] = sbaDatum
        })

        // dispatch an action that will set the actual geometry & region data on the state
        dispatch(setDistrictRegionTypeAndRegions({district, regionType, geometry, regions}))

      })

  // TODO error handling if either request failed
   
  }
}

export function setDistrictRegionTypeAndRegions({district, regionType, geometry, regions}) {
  return {
    type: 'SET_DISTRICT_REGION_TYPE_AND_REGIONS',
    district,
    regionType,
    geometry,
    regions
  }
}


////////////////// Reducers //////////////////////


export default function regionsReducer(state, action) {
  const {type, district, regionType, geometry, regions} = action
  switch(type) {
    case 'SET_DISTRICT_REGION_TYPE_AND_REGIONS':
      return Object.assign({}, state, {
        geometry,
        regions,
        ui: Object.assign({}, state.ui, {
          selectedDistrict: district,
          selectedRegionType: regionType,
        })
      })

    default: return state
  }
}
