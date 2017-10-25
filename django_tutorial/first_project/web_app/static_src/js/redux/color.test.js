import { Reducer, Selector } from 'redux-testkit';
import reducer, * as fromColor from './color'
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


describe('color actions', () => {
  it('should create an action to set the color field', () => {
    const colorField = 'mean_agi'
    const expectedAction = {
      type: 'SET_COLOR_FIELD',
      colorField
    }
    expect(fromColor.setColorField(colorField)).toEqual(expectedAction)
  })
})


describe('color selectors', () => {
  it('should not modify state', () => {
    const state = reducer()
    Selector(fromColor.getColorField).execute(state)
    Selector(fromColor.getColorQuantiler).execute(state)
    Selector(fromColor.getNumColorQuantiles).execute(state)
  })
})


describe('color reducer', () => {

  it('should create initial state', () => {
    const state = reducer()

    expect(fromColor.getColorField(state)).toEqual('sba_per_small_bus')
    expect(fromColor.getColorQuantiler(state)).toBeUndefined()
    expect(fromColor.getNumColorQuantiles(state)).toEqual(10)
  })

  it('should handle colorField actions', () => {
    const action = fromColor.setColorField('mean_agi')
    const state = reducer(undefined, action, mockFeatureState)

    expect(fromColor.getColorField(state)).toEqual('mean_agi')
    expect(fromColor.getColorQuantiler(state).thresholds[0]).toEqual(11000)  // checks that quantiler was built with sba_per_small_bus
    expect(fromColor.getNumColorQuantiles(state)).toEqual(10)
  })

  it('should handle setting new features', () => {
    const action = setDistrictRegionTypeAndFeatures({})
    const state = reducer(undefined, action, mockFeatureState)

    expect(fromColor.getColorField(state)).toEqual('sba_per_small_bus')
    expect(fromColor.getColorQuantiler(state).thresholds[0]).toBeCloseTo(0.11, 2)  // checks that quantiler was built with sba_per_small_bus
    expect(fromColor.getNumColorQuantiles(state)).toEqual(10)
  })

  it('should handle an invalid color field when setting new features', () => {
    // in this case we take a default state and change the featureType from 'region' to 'business', to check
    // that the color reducer will correctly change the color field to one of the valid 'business' fields
    const action = setDistrictRegionTypeAndFeatures({})
    const state = reducer(undefined, action, {...mockFeatureState, featureType: 'business'})

    expect(fromColor.getColorField(state)).toEqual('rating')
    expect(fromColor.getColorQuantiler(state).thresholds[0]).toBeCloseTo(1.1, 2)  // checks that quantiler was built with sba_per_small_bus
    expect(fromColor.getNumColorQuantiles(state)).toEqual(10)
  })
})