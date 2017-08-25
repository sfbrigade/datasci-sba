
/**
 * Constructs a set of quantile thresholds for an array of data.  Immutable.
 * Meant to be used by creating a Quantiler from the data, then 
 */
export class Quantiler {

  /**
   * @param {number[]} values
   * @param {number} numQuantiles
   */
  constructor(values, numQuantiles=10) {
    values = values.filter(value => value != null && !isNaN(value))
    values.sort((a, b) => a - b)

    // note that this.thresholds will contain (numQuantiles-1) entries, representing
    // the boundary values between each of the quantiles
    this.thresholds = []
    for(let i = 1; i < numQuantiles; i++) {
      let index = i * values.length / numQuantiles
      this.thresholds[i-1] = (values[Math.floor(index)] + values[Math.ceil(index)]) / 2
    }
  }

  /**
   * @param {number} value
   * @returns {number} the 0-based quantile that contains the given value.  Will be an integer
   * in [0, numQuantiles-1] inclusive.  If the given value is below the lowest quantile or 
   * above the highest quantile, will simply return 0 or numQuantiles-1, respectively.  Returns
   * undefined if value is NaN.
   */
  getQuantile(value) {
    if(value != null && !isNaN(value)) {
      let index = this.thresholds.findIndex(threshold => value < threshold)
      if(index === -1) {
        index = this.thresholds.length
      }
      return index
    }
  }
}

/**
 * Rounds a number to a given decimal precision
 * @param {number} number
 * @param {number=} precision
 * @returns {number}
 */
export function round(number, precision=0) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}



/**
 * Utility function that returns a reducer that simply applies all
 * of the given reducers to the state
 * @param {Function[]} reducers
 * @return {Function}
 */
export function composeReducers(reducers) {
  return function(state, action) {
    return reducers.reduce(function(_state, reducer) {
      return reducer(_state, action)
    }, state)
  }
}




// keeps track of which fields we let the user select for coloring & filtering
export const fields = {
  'sba_per_small_bus': {
    userReadableName: 'Total SBA Loans per Small Business'
  },
  'loan_504_per_small_bus': {
    userReadableName: '504 Loans per Small Biz'
  },
  'loan_7a_per_small_bus': {
    userReadableName: '7a Loans per Small Biz'
  },
  'mean_agi': {
    userReadableName: 'Mean AGI'
  },
  'total_7a': {
    userReadableName: 'Total 7a Loans'
  },
  'total_504': {
    userReadableName: 'Total 504 Loans'
  },
  'total_sba': {
    userReadableName: 'Total SBA Loans'
  },
  'total_small_bus': {
    userReadableName: 'Total Small Businesses'
  }
}

/**
 * @return {String[]} all the keys in the 'fields' object, ordered by their user-readable names
 */
export function getOrderedFields() {
  let orderedFields = Object.keys(fields)
  orderedFields.sort((a, b) => fields[a].userReadableName < fields[b].userReadableName)
  return orderedFields
}

