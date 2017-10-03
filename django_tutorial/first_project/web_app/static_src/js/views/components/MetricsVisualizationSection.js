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
import { styler } from 'react-timeseries-charts'

import { Card, CardHeader, CardText } from 'material-ui/Card'

const style = styler([
  {key: "loans", color: "rgb(34, 150, 243)", width: 2},
  {key: "jobs", color: "#9467bd", width: 2}
])

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
        yearToSumOfValues[biz.year] = yearToSumOfValues[biz.year] || {jobs: 0, loans: 0}
        yearToSumOfValues[biz.year].jobs += biz.jobs_supported
        yearToSumOfValues[biz.year].loans += 1
      }
    })
    let formattedArr = []
    for(let year in yearToSumOfValues) {
      formattedArr.push([new Date(year, 1, 1).getTime(), yearToSumOfValues[year].loans, yearToSumOfValues[year].jobs])
    }
    formattedArr.sort((a, b) => a[0] - b[0]);
    return new TimeSeries({
      name: "SBA over time",
      columns: ["time", "loans", "jobs"],
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
        <ChartContainer timeRange={series.range()} format="'%y" padding="20">
            <ChartRow height="300">
                <YAxis
                    id="loans"
                    label="Loans"
                    min={0}
                    max={series.max('loans')}
                    width="60"
                    type="linear"
                    style={style.axisStyle('loans')}
                />
                <YAxis
                    id="jobs"
                    label="Jobs Supported"
                    min={0}
                    max={series.max('jobs')}
                    width="60"
                    type="linear"
                    style={style.axisStyle('jobs')}
                />
                <Charts>
                    <LineChart
                      key="loans"
                      axis="loans"
                      series={series}
                      columns={["loans"]}
                      style={style}
                      interpolation="curveBasis" />
                    <LineChart
                      key="jobs"
                      axis="jobs"
                      series={series}
                      columns={["jobs"]}
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

