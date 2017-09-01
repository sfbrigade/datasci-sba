import React from 'react'

import * as d3 from "d3";




let nextId = 1
const createNextId = () => nextId++


/**
 * React component that renders a histogram, using D3.
 * 
 * We don't really use React's lifecycle here; instead we use D3 for DOM updates.
 * Thus our React render method is just a div, and the real work happens in componentDidMount (for
 * initialization) and componentDidUpdate (to do the rendering when the state has changed)
 */
export default class Histogram extends React.Component {

  constructor(props) {
  	super(props)
    this.id = createNextId()
  }

  getDivId() {
    return `histogram-${this.id}`
  }

  /**
   * called by React after the DOM element is first added to the page; we use this to
   * initialize the svg
   */
  componentDidMount() {
    this.svg = d3.select(`#${this.getDivId()}`).append('svg')
  }


  /**
   * called by React after each props/state update; we use this to tell d3 to re-render
   */
  componentDidUpdate(prevProps) {

    // remove any nulls or NaNs from the data
  	let data = this.props.data.filter(value => value != null && !isNaN(value))

    // TODO for performance: as a quick hack we're currently just wiping and rebuilding the svg; instead
    // we should have it just update the existing svg elements
  	this.svg.remove()
  	this.svg = d3.select(`#${this.getDivId()}`).append('svg')

    // the following code is modified from the histogram example here: https://bl.ocks.org/mbostock/3048450

	  let margin = {top: 10, right: 0, bottom: 30, left: 0}
    let width = parseFloat(d3.select(`#${this.getDivId()}`).style("width")) - margin.left - margin.right
    let height = parseFloat(d3.select(`#${this.getDivId()}`).style("height")) - margin.top - margin.bottom
    let g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var x = d3.scaleLinear()
    	.domain([Math.min(...data), Math.max(...data)])
        .rangeRound([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(40))
        (data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var bar = g.selectAll(".bar")
      .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    let rect = bar.append("rect")
        .attr("x", 0)
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("height", function(d) { return height - y(d.length); });
    if(this.props.colorFunction) {
    	rect.attr("fill", d => this.props.colorFunction(d.x0))
    }


    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    (this.props.lines || []).forEach(lineValue => {
      g.append("line")
        .attr("x1", x(lineValue))
        .attr("x2", x(lineValue))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "blue")
    })
  }



  render() {
    return <div className="histogram" id={this.getDivId()}/>
  }
}

