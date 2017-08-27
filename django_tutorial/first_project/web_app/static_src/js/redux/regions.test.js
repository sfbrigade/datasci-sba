import { Reducer, Selector, Thunk } from 'redux-testkit';
import reducer, * as fromRegions from './regions'
import * as api from '../api'
jest.mock('../api')



describe('region actions', () => {

  it('should create an action to set the moused region', () => {
    const mousedRegionId = 'foo'
    expect(fromRegions.setMousedRegionId(mousedRegionId)).toEqual({
      type: 'SET_MOUSED_REGION',
      mousedRegionId
    })
  })

  it('should create an action to set all region data', () => {
    const selectedDistrict = 'SFDO'
    const selectedRegionType = 'zip'
    const geometry = {foo: 'bar'}
    const regions = {foo: 'baz'}
    expect(fromRegions.setDistrictRegionTypeAndRegions({selectedDistrict, selectedRegionType, geometry, regions})).toEqual({
      type: 'SET_DISTRICT_REGION_TYPE_AND_REGIONS',
      selectedDistrict,
      selectedRegionType,
      geometry,
      regions
    })
  })

  it('should create an action that loads region data', () => {
    const selectedDistrict = 'NYC'
    const selectedRegionType = 'cd'
    const regions = {data: [{region: 'foo', mean_agi: '10000'}]}
    const geometry = {foo: 'bar'}
    api.getRegions.mockReturnValueOnce(regions)
    api.getGeometry.mockReturnValueOnce(geometry)
    return Thunk(fromRegions.fetchRegions).execute({selectedDistrict, selectedRegionType})
      .then(dispatches => {
        expect(dispatches[0].isPlainObject()).toBe(true);
        expect(dispatches[0].getType()).toEqual('SET_DISTRICT_REGION_TYPE_AND_REGIONS');
        expect(dispatches[0].getAction()).toEqual({
          type: 'SET_DISTRICT_REGION_TYPE_AND_REGIONS',
          selectedDistrict,
          selectedRegionType,
          geometry,
          regions: {
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
})


describe('region selectors', () => {
  it('should not modify state', () => {
    const state = reducer()
    Selector(fromRegions.getRegions).execute(state)
    Selector(fromRegions.getGeometry).execute(state)
    Selector(fromRegions.getSelectedDistrict).execute(state)
    Selector(fromRegions.getSelectedRegionType).execute(state)
    Selector(fromRegions.getMousedRegion).execute(state)
  })
})


describe('region reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromRegions.getRegions(state)).toEqual({})
    expect(fromRegions.getGeometry(state)).toEqual({})
    expect(fromRegions.getSelectedDistrict(state)).toEqual('SFDO')
    expect(fromRegions.getSelectedRegionType(state)).toEqual('zip')
    expect(fromRegions.getMousedRegion(state)).toBeUndefined()
  })

  it('should update region data', () => {
    const selectedDistrict = 'NYC'
    const selectedRegionType = 'cd'
    const geometry = {geo: 'foo'}
    const regions = {regions: 'bar'}
    const action = fromRegions.setDistrictRegionTypeAndRegions({
      selectedDistrict,
      selectedRegionType,
      geometry,
      regions
    })
    const state = reducer(undefined, action)

    expect(fromRegions.getSelectedDistrict(state)).toEqual(selectedDistrict)
    expect(fromRegions.getSelectedRegionType(state)).toEqual(selectedRegionType)
    expect(fromRegions.getGeometry(state)).toEqual(geometry)
    expect(fromRegions.getRegions(state)).toEqual(regions)
  })

  it('should update moused region', () => {
    const mousedRegionId = 'foo'
    const myRegion = {id: 'foo'}
    const initialState = {
      regions: {
        foo: myRegion
      }
    }

    const action1 = fromRegions.setMousedRegionId(mousedRegionId)
    const state1 = reducer(initialState, action1)
    expect(fromRegions.getMousedRegion(state1)).toEqual(myRegion)

    // also test that we can set it to undefined
    const action2 = fromRegions.setMousedRegionId()
    const state2 = reducer(state1, action2)
    expect(fromRegions.getMousedRegion(state2)).toBeUndefined()

  })

})