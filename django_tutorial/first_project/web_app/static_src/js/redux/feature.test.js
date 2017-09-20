import { Reducer, Selector, Thunk } from 'redux-testkit';
import reducer, * as fromFeature from './feature'
import * as api from '../api'
jest.mock('../api')



describe('feature actions', () => {

  it('should create an action to set the moused feature', () => {
    const mousedFeatureId = 'foo'
    expect(fromFeature.setMousedFeatureId(mousedFeatureId)).toEqual({
      type: 'SET_MOUSED_FEATURE',
      mousedFeatureId
    })
  })

  it('should create an action to set all feature data', () => {
    const selectedDistrict = 'SFDO'
    const selectedRegionType = 'zip'
    const geometry = {foo: 'bar'}
    const features = {foo: 'baz'}
    expect(fromFeature.setDistrictRegionTypeAndFeatures({selectedDistrict, selectedRegionType, geometry, features})).toEqual({
      type: 'SET_DISTRICT_REGION_TYPE_AND_FEATURES',
      selectedDistrict,
      selectedRegionType,
      geometry,
      features
    })
  })

  it('should create an action that loads region data', () => {
    const featureType = 'region'
    const selectedDistrict = 'NYC'
    const selectedRegionType = 'cd'
    const features = {data: [{region: 'foo', mean_agi: '10000'}]}
    const geometry = {foo: 'bar'}
    api.getRegions.mockReturnValueOnce(features)
    api.getGeometry.mockReturnValueOnce(geometry)
    return Thunk(fromFeature.fetchFeatures).execute({featureType, selectedDistrict, selectedRegionType})
      .then(dispatches => {
        expect(dispatches[0].isPlainObject()).toBe(true);
        expect(dispatches[0].getType()).toEqual('SET_DISTRICT_REGION_TYPE_AND_FEATURES');
        expect(dispatches[0].getAction()).toEqual({
          type: 'SET_DISTRICT_REGION_TYPE_AND_FEATURES',
          featureType,
          selectedDistrict,
          selectedRegionType,
          geometry,
          features: {
            foo: {
              "loan_504_per_small_bus": NaN,
              "loan_7a_per_small_bus": NaN,
              "mean_agi": 10000,
              "region": "foo",
              "sba_per_small_bus": NaN,
              "total_504": NaN,
              "total_7a": NaN,
              "total_sba": NaN,
              "total_small_bus": NaN
            }
          }
        });
    })
  })

  it('should create an action that loads business data', () => {
    const featureType = 'business'
    const selectedDistrict = 'NYC'
    const selectedRegionType = 'cd'
    const businesses = {data: [{id: 1, name: 'foo', rating: 10000}]}
    api.getBusinesses.mockReturnValueOnce(businesses)
    return Thunk(fromFeature.setFeatureType).execute(featureType, {selectedDistrict, selectedRegionType})
      .then(dispatches => {
        expect(dispatches[0].isPlainObject()).toBe(true);
        expect(dispatches[0].getType()).toEqual('SET_DISTRICT_REGION_TYPE_AND_FEATURES');
        expect(dispatches[0].getAction()).toEqual({
          type: 'SET_DISTRICT_REGION_TYPE_AND_FEATURES',
          featureType,
          selectedDistrict,
          selectedRegionType,
          features: {
            1: {
              id: 1,
              name: 'foo',
              rating: 10000
            }
          }
        });
    })
  })

})


describe('feature selectors', () => {
  it('should not modify state', () => {
    const state = reducer()
    Selector(fromFeature.getFeatures).execute(state)
    Selector(fromFeature.getGeometry).execute(state)
    Selector(fromFeature.getSelectedDistrict).execute(state)
    Selector(fromFeature.getSelectedRegionType).execute(state)
    Selector(fromFeature.getMousedFeature).execute(state)
    Selector(fromFeature.getFeatureType).execute(state)
    Selector(fromFeature.getOrderedFieldKeys).execute(state)
  })

  it('should give field keys, in order by readable name',() => {
    const state = reducer()

    const stateWithFeatureTypeRegion = {...state, featureType: 'region'}
    expect(fromFeature.getOrderedFieldKeys(stateWithFeatureTypeRegion)).toEqual([
      "loan_504_per_small_bus", "loan_7a_per_small_bus", "mean_agi", "total_504", "total_7a", "total_sba", "sba_per_small_bus", "total_small_bus"
    ])

    const stateWithFeatureTypeBusiness = {...state, featureType: 'business'}
    expect(fromFeature.getOrderedFieldKeys(stateWithFeatureTypeBusiness)).toEqual([
      "yelp_rating"
    ])
  })
})


describe('feature reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromFeature.getFeatures(state)).toEqual({})
    expect(fromFeature.getGeometry(state)).toEqual({})
    expect(fromFeature.getSelectedDistrict(state)).toEqual('SFDO')
    expect(fromFeature.getSelectedRegionType(state)).toEqual('zip')
    expect(fromFeature.getMousedFeature(state)).toBeUndefined()
    expect(fromFeature.getFeatureType(state)).toEqual('region')
  })

  it('should update feature data', () => {
    const selectedDistrict = 'NYC'
    const selectedRegionType = 'cd'
    const geometry = {geo: 'foo'}
    const features = {features: 'bar'}
    const featureType = 'business'
    const action = fromFeature.setDistrictRegionTypeAndFeatures({
      selectedDistrict,
      selectedRegionType,
      geometry,
      features,
      featureType
    })
    const state = reducer(undefined, action)

    expect(fromFeature.getSelectedDistrict(state)).toEqual(selectedDistrict)
    expect(fromFeature.getSelectedRegionType(state)).toEqual(selectedRegionType)
    expect(fromFeature.getGeometry(state)).toEqual(geometry)
    expect(fromFeature.getFeatures(state)).toEqual(features)
    expect(fromFeature.getFeatureType(state)).toEqual(featureType)
  })

  it('should update moused feature', () => {
    const mousedFeatureId = 'foo'
    const myFeature = {id: 'foo'}
    const initialState = {
      features: {
        foo: myFeature
      }
    }

    const action1 = fromFeature.setMousedFeatureId(mousedFeatureId)
    const state1 = reducer(initialState, action1)
    expect(fromFeature.getMousedFeature(state1)).toEqual(myFeature)

    // also test that we can set it to undefined
    const action2 = fromFeature.setMousedFeatureId()
    const state2 = reducer(state1, action2)
    expect(fromFeature.getMousedFeature(state2)).toBeUndefined()

  })

})