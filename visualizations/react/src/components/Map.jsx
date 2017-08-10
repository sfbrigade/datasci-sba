import axios from 'axios';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';
import Promise from 'bluebird';
import React from 'react';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    Promise.resolve(axios({
      url: '/src/files/ca_zips.json',
    })).then(response => {
      this.setState({
        data: response.data,
      });
    });
  }

  render() {
    const { className } = this.props;
    const { data } = this.state;

    if (!data) {
      return null;
    }

    const zips = feature(data, data.objects.ca_zips);

    const projection = geoMercator()
      .scale(2500)
      .translate([5500, 2100]);

    const pathGenerator = geoPath()
      .projection(projection);

    return (
      <svg
        className={className}
        height={960}
        width={960}
      >
        <path
          d={pathGenerator(zips)}
          fill="pink"
          stroke="red"
          strokeWidth="1"
        />
      </svg>
    );
  }
}
