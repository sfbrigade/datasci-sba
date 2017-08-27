import { Reducer, Selector } from 'redux-testkit';
import reducer, * as fromFilter from './filter'
import { setDistrictRegionTypeAndRegions } from './regions'


const mockRegionState = {
  regions: {
    id0: {
      sba_per_small_bus: 0.1,
      mean_agi: 10000
    },
    id1: {
      sba_per_small_bus: 0.2,
      mean_agi: 20000
    }
  }
}


describe('filter actions', () => {

  it('should create an action to set the filter field', () => {
    const filterField = 'mean_agi'
    expect(fromFilter.setFilterField(filterField)).toEqual({
      type: 'SET_FILTER_FIELD',
      filterField
    })
  })

  it('should create an action to set the filter range', () => {
  	const filterRange = [0, 1]
  	expect(fromFilter.setFilterRange(filterRange)).toEqual({
      type: 'SET_FILTER_RANGE',
      filterRange
    })
  })
})


describe('filter selectors', () => {
  it('should not modify state', () => {
    const state = reducer()
    Selector(fromFilter.getFilterField).execute(state)
    Selector(fromFilter.getFilterRange).execute(state)
  })
})


describe('filter reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromFilter.getFilterField(state)).toEqual('sba_per_small_bus')
    expect(fromFilter.getFilterRange(state)).toEqual([0, 1])
  })

  it('should update filterField', () => {
    const action = fromFilter.setFilterField('mean_agi')
    const state = reducer(undefined, action, mockRegionState)

    expect(fromFilter.getFilterField(state)).toEqual('mean_agi')
    expect(fromFilter.getFilterRange(state)).toEqual([10000, 20000])  // checks that range defaults to full min,max of data
  })

  it('should update filterRange', () => {
  	const range = [5, 10]
    const action = fromFilter.setFilterRange(range)
    const state = reducer(undefined, action, mockRegionState)

    expect(fromFilter.getFilterField(state)).toEqual('sba_per_small_bus')	// unchanged from default
    expect(fromFilter.getFilterRange(state)).toEqual(range)
  })

  it('should update filter range when setting new regions', () => {
    const action = setDistrictRegionTypeAndRegions({})
    const state = reducer(undefined, action, mockRegionState)

    expect(fromFilter.getFilterField(state)).toEqual('sba_per_small_bus')
    expect(fromFilter.getFilterRange(state)).toEqual([0.1, 0.2])  // checks that range defaults to full min,max of data
  })
})