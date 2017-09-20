import { Reducer, Selector } from 'redux-testkit';
import reducer, * as fromRoot from './root'
import { setDistrictRegionTypeAndFeatures, getFeatures } from './feature'
import { getFilterRange } from './filter'


const mockFeatures = {
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
    Selector(fromRoot.getFeatureState).execute(state)
    Selector(fromRoot.getColorState).execute(state)
    Selector(fromRoot.getFilterState).execute(state)
  })
})





describe('root reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromRoot.getFeatureState(state)).toBeDefined()
    expect(fromRoot.getColorState(state)).toBeDefined()
    expect(fromRoot.getFilterState(state)).toBeDefined()
    expect(getFilterRange(fromRoot.getFilterState(state))).toEqual([0, 1])
  })


  it('should update filter range when setting new features', () => {
  	// this action should affect both features and filter; we test this action
  	// in order to test how the root reducer runs the features reducer first,
  	// then the color & filter reducers

    const action = setDistrictRegionTypeAndFeatures({featureType: 'region', features: mockFeatures})
    const state = reducer(undefined, action)

    // check that filter state is updated
    expect(getFilterRange(fromRoot.getFilterState(state))).toEqual([0.1, 0.2])  // checks that range defaults to full min,max of data

    // check that feature state is updated
    expect(getFeatures(fromRoot.getFeatureState(state))).toEqual(mockFeatures)
  })
})