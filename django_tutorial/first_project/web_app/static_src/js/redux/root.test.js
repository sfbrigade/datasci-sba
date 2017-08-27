import { Reducer, Selector } from 'redux-testkit';
import reducer, * as fromRoot from './root'
import { setDistrictRegionTypeAndRegions, getRegions } from './regions'
import { getFilterRange } from './filter'


const mockRegions = {
  id0: {
    sba_per_small_bus: 0.1,
    mean_agi: 10000
  },
  id1: {
    sba_per_small_bus: 0.2,
    mean_agi: 20000
  }
}



describe('root selectors', () => {
  it('should not modify state', () => {
    const state = reducer()
    Selector(fromRoot.getRegionState).execute(state)
    Selector(fromRoot.getColorState).execute(state)
    Selector(fromRoot.getFilterState).execute(state)
  })
})





describe('root reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromRoot.getRegionState(state)).toBeDefined()
    expect(fromRoot.getColorState(state)).toBeDefined()
    expect(fromRoot.getFilterState(state)).toBeDefined()
    expect(getFilterRange(fromRoot.getFilterState(state))).toEqual([0, 1])
  })


  it('should update filter range when setting new regions', () => {
  	// this action should affect both regions and filter; we test this action
  	// in order to test how the root reducer runs the regions reducer first,
  	// then the color & filter reducers

    const action = setDistrictRegionTypeAndRegions({regions: mockRegions})
    const state = reducer(undefined, action)

    // check that filter state is updated
    expect(getFilterRange(fromRoot.getFilterState(state))).toEqual([0.1, 0.2])  // checks that range defaults to full min,max of data

    // check that region state is updated
    expect(getRegions(fromRoot.getRegionState(state))).toEqual(mockRegions)
  })
})