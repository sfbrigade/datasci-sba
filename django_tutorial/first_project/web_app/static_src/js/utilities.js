
/**
 * Constructs a set of quantile thresholds for an array of data.  Immutable.
 * Meant to be used by creating a Quantiler from the data, then using
 * quantiler.getQuantile(value) to get the quantile of any datapoint.
 *
 * For instance, suppose we have a bunch of test scores, and we want to tell
 * a student "you were in the top X% of your class".  We would create a Quantiler
 * with the test scores (passsing numQuantiles=100 to produce percentiles),
 * and then e.g. if quantiler.getQuantile(yourTestScore) == 99, it means you're
 * in the top 1% of your class.
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
      let index = (values.length - 1) * i / numQuantiles
      let floorIndex = Math.floor(index)
      this.thresholds[i-1] = values[floorIndex] + (index - floorIndex) * (values[floorIndex+1]-values[floorIndex])
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




// export function liftSelectors(selectors, key) {
//   Object.assign({}, ...Object.keys(selectors).map(k => ({[k]: function() {
//     return fs[k](arguments[0][key], ...Array.prototype.slice.call(arguments, 1))
//   }})))
// }



export function calculateColor(value, quantiler) {
  // TODO: don't use a red/green color scheme!  use viridis instead?

  var low = [5, 69, 54];  // color of smallest datum
  var high = [151, 83, 34];   // color of largest datum

  // delta represents where the value sits between the min and max
  let quantile = quantiler.getQuantile(value)

  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * quantile / (quantiler.thresholds.length) + low[i];
  }

  return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)'
}