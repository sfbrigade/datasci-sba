import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TimeSeries } from 'pondjs'
import { ChartContainer } from 'react-timeseries-charts'
import { ChartRow } from 'react-timeseries-charts'
import { Charts } from 'react-timeseries-charts'
import { YAxis } from 'react-timeseries-charts'
import { LineChart } from 'react-timeseries-charts'
import { Baseline } from 'react-timeseries-charts'
import { Resizable } from 'react-timeseries-charts'

import { Card, CardHeader, CardText } from 'material-ui/Card'

const style = {
  value: {
      stroke: "#a02c2c",
      opacity: 0.2
  }
};

const baselineStyle = {
  line: {
      stroke: "steelblue",
      strokeWidth: 1
  }
};

const baselineStyleLite = {
  line: {
      stroke: "steelblue",
      strokeWidth: 1,
      opacity: 0.5
  }
};

export default class MetricsVisualizationSection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tracker: null,
      timerange: undefined,
      series: undefined
    };

  }

  getSeries() {
    let arrayOfProps = Object.values(this.props.filteredBusinesses);
    let yearToSumOfValues = {}
    arrayOfProps.forEach(biz => {
      if(!isNaN(biz.jobs_supported) && !isNaN(biz.year)) {
        yearToSumOfValues[biz.year] = (yearToSumOfValues[biz.year] || 0) + biz.jobs_supported
      }
    })
    let formattedArr = []
    for(let year in yearToSumOfValues) {
      formattedArr.push([new Date(year, 1, 1).getTime(), yearToSumOfValues[year]])
    }
    formattedArr.sort((a, b) => a[0] - b[0]);
    return new TimeSeries({
      name: "SBA over time",
      columns: ["time", "value"],
      points: formattedArr
    });
  }

  handleTrackerChanged(tracker) {
    this.setState({ tracker });
  }

  handleTimeRangeChange(timerange) {
    this.setState({ timerange });
  }

  render() {
    let series = this.getSeries()
    if (series === undefined) {
      return ( <div>Loading</div> );
    } else {
      return (
        <Card className="metrics-section metrics-viz">
        <CardHeader title="Dataviz Header" />
        <Resizable>
        <ChartContainer timeRange={series.range()} format="'%y">
            <ChartRow height="300">
                <YAxis
                    id="jobs"
                    label="Jobs Created"
                    min={0}
                    max={series.max()}
                    width="100"
                    type="linear"
                />
                <Charts>
                    <LineChart
                      axis="jobs"
                      series={series}
                      columns={["value"]}
                      style={style}
                      interpolation="curveBasis" />
                  </Charts>
                </ChartRow>
            </ChartContainer>
          </Resizable>
        </Card>
      );
    }
  }
}

