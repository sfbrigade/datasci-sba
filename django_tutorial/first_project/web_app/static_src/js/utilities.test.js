import * as fromUtilities from './utilities'

describe('quantiler', () => {
	it('should calculate thresholds', () => {
		let quantiler = new fromUtilities.Quantiler([3, 2, 4, 1], 3)	// note input values out of order
		expect(quantiler.thresholds.length).toEqual(2)
		expect(quantiler.thresholds[0]).toEqual(2)
		expect(quantiler.thresholds[1]).toEqual(3)
	})

	it('should default to 10 quantiles', () => {
		let quantiler = new fromUtilities.Quantiler([3, 2, 4, 1])
		expect(quantiler.thresholds.length).toEqual(9)
	})

	it('should give appropriate quantiles for values', () => {
		let quantiler = new fromUtilities.Quantiler([3, 2, 4, 1], 3)	// note input values out of order
		expect(quantiler.getQuantile(-100)).toBe(0)
		expect(quantiler.getQuantile(1)).toBe(0)
		expect(quantiler.getQuantile(2)).toBe(1)
		expect(quantiler.getQuantile(3)).toBe(2)
		expect(quantiler.getQuantile(4)).toBe(2)
		expect(quantiler.getQuantile(100)).toBe(2)
	})
})



describe('round', () => {
	it('should round numbers', () => {
		expect(fromUtilities.round(123.456, 2)).toEqual(123.46)
		expect(fromUtilities.round(123, 0)).toEqual(123)
	})
})


describe('getOrderedFields', () => {
	it('should give field keys, in order by readable name',() => {
		expect(fromUtilities.getOrderedFields()).toEqual([
			"foo", "total_small_bus", "sba_per_small_bus", "total_sba", "total_7a", "total_504", "mean_agi", "loan_7a_per_small_bus", "loan_504_per_small_bus"
		])
	})
})