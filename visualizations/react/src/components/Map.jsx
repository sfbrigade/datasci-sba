import axios from 'axios';
import classNames from 'classnames';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';
import Promise from 'bluebird';
import React from 'react';
import TetherComponent from 'react-tether';

import styles from './Map.scss';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: null,
      zips: null,
    };
  }

  componentDidMount() {
    Promise.resolve(axios({
      url: '/src/files/ca_zips.json',
    })).then(response => {
      const data = response.data;
      const zips = feature(data, data.objects.ca_zips);

      this.setState({
        zips,
      });
    });
  }

  render() {
    const { className } = this.props;
    const { current, zips } = this.state;

    if (!zips) {
      return null;
    }

    const width = 600;
    const height = 600;

    const projection = geoMercator()
      .center([-122.4, 37.7])
      .scale(4 * width)
      .translate([width / 2, height / 2]);

    const pathGenerator = geoPath()
      .projection(projection);

    return (
      <div
        className={classNames('', className)}
      >
        <svg
          height={height}
          width={width}
        >
          {zips.features.map((feature, i) => (
            <TetherComponent
              attachment="bottom center"
              key={i}
              targetAttachment="top center"
            >
              <path
                className={styles.zip}
                d={pathGenerator(feature)}
                onMouseEnter={() => this.setState({
                  current: i,
                })}
                onMouseLeave={() => this.setState({
                  current: null,
                })}
              />
              {current === i && <div
                className="panel panel-default"
                style={{
                  margin: 0,
                }}
              >
                <div className="panel-heading">
                  Heading {i}
                </div>
                <div className="panel-body">
                  Content {i}
                </div>
              </div>}
            </TetherComponent>
          ))}
        </svg>
      </div>
    );
  }
}
