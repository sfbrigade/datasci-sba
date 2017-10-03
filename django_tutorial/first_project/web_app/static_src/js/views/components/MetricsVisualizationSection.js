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

    this.formatData = this.formatData.bind(this);
  }

  componentDidMount() {
    this.formatData();
  }

  formatData() {
    let arrayOfProps = Object.values(this.props.filteredBusinesses);
    let formattedArr = arrayOfProps.map(biz => {
      return [new Date(biz.year, 1, 1).getTime(), biz.jobs_supported];
    })
    formattedArr.sort((a, b) => a[0] - b[0]);
    console.log(formattedArr);
    const series = new TimeSeries({
      name: "SBA over time",
      columns: ["time", "value"],
      points: formattedArr
    });
    this.setState({ series });
  }

  handleTrackerChanged(tracker) {
    this.setState({ tracker });
  }

  handleTimeRangeChange(timerange) {
    this.setState({ timerange });
  }

  render() {
    if (this.state.series === undefined) {
      return ( <div>Loading</div> );
    } else {
      console.log('range', this.state.series.range());
      return (
        <Card className="metrics-section metrics-viz">
        <CardHeader title="Dataviz Header" />
        <Resizable>
        <ChartContainer timeRange={this.state.series.range()} format="%b '%y">
            <ChartRow height="100%">
                <YAxis
                    id="jobs"
                    label="Jobs Created"
                    min={this.state.series.min()}
                    max={this.state.series.max()}
                    width="100"
                />
                <Charts>
                    <LineChart axis="year" series={this.state.series} style={style} />
                    <Baseline
                        axis="jobs created"
                        style={baselineStyleLite}
                        value={this.state.series.max()}
                        label="Max"
                        position="right"
                    />
                    <Baseline
                        axis="jobs created"
                        style={baselineStyleLite}
                        value={this.state.series.min()}
                        label="Min"
                        position="right"
                    />
                    <Baseline
                        axis="jobs created"
                        style={baselineStyleLite}
                        value={this.state.series.avg() - this.state.series.stdev()}
                    />
                    <Baseline
                        axis="jobs created"
                        style={baselineStyleLite}
                        value={this.state.series.avg() + this.state.series.stdev()}
                    />
                    <Baseline
                        axis="jobs created"
                        style={baselineStyle}
                        value={this.state.series.avg()}
                        label="Avg"
                        position="right"
                    />
                  </Charts>
                </ChartRow>
            </ChartContainer>
          </Resizable>
        </Card>
      );
    }
  }
}

