import { Reducer, Selector } from 'redux-testkit';
import reducer, * as fromFilter from './filter'
import { setDistrictRegionTypeAndFeatures } from './feature'


const mockFeatureState = {
  featureType: 'region',
  features: {
    id0: {
      sba_per_small_bus: 0.1,
      mean_agi: 10000,
      rating: 1
    },
    id1: {
      sba_per_small_bus: 0.2,
      mean_agi: 20000,
      rating: 2
    }
  },
  fields: {
    region: {
      'sba_per_small_bus': {
        userReadableName: 'Total SBA Loans per Small Business'
      },
      'mean_agi': {
        userReadableName: 'Mean AGI'
      }
    },
    business: {
      'rating': {
        userReadableName: 'Rating'
      }
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

  it('should calculate field extent', () => {
    expect(fromFilter.getFieldExtent(mockFeatureState, 'sba_per_small_bus')).toEqual([0.1, 0.2])

    expect(fromFilter.getFieldExtent(null, null)).toEqual([0,1])
    expect(fromFilter.getFieldExtent({features: {}}, null)).toEqual([0,1])
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
    const state = reducer(undefined, action, mockFeatureState)

    expect(fromFilter.getFilterField(state)).toEqual('mean_agi')
    expect(fromFilter.getFilterRange(state)).toEqual([10000, 20000])  // checks that range defaults to full min,max of data
  })


  it('should update filterRange', () => {
  	const range = [5, 10]
    const action = fromFilter.setFilterRange(range)
    const state = reducer(undefined, action, mockFeatureState)

    expect(fromFilter.getFilterField(state)).toEqual('sba_per_small_bus')	// unchanged from default
    expect(fromFilter.getFilterRange(state)).toEqual(range)
  })

  it('should update filter range when setting new features', () => {
    const action = setDistrictRegionTypeAndFeatures({})
    const state = reducer(undefined, action, mockFeatureState)

    expect(fromFilter.getFilterField(state)).toEqual('sba_per_small_bus')
    expect(fromFilter.getFilterRange(state)).toEqual([0.1, 0.2])  // checks that range defaults to full min,max of data
  })

  it('should handle an invalid filter field when setting new features', () => {
    // in this case we take a default state and change the featureType from 'region' to 'business', to check
    // that the filter reducer will correctly change the filter field to one of the valid 'business' fields
    const action = setDistrictRegionTypeAndFeatures({})
    const state = reducer(undefined, action, {...mockFeatureState, featureType: 'business'})

    expect(fromFilter.getFilterField(state)).toEqual('rating')
    expect(fromFilter.getFilterRange(state)).toEqual([1, 2])  // checks that range defaults to full min,max of data
  })
})