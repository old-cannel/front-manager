import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

@connect(({}) => ({}))
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'index/getTable' });
  }

  render() {
    const { tableOne, tableTwo } = this.props;

    const colsOne = {
      value: {
        min: 0,
      },
      day: {
        range: [0, 1],
      },
    };

    const colsTwo = {
      value: {
        min: 0,
      },
      month: {
        range: [0, 1],
      },
    };
    return (
      <Row gutter={20}>
        <Col span={10}>
          <Card title="每日新增订单" bordered>
            <Chart height={400} data={tableOne} scale={colsOne} forceFit>
              <Axis name="day" />
              <Axis name="value" />
              <Tooltip
                crosshairs={{
                  type: 'y',
                }}
              />
              <Geom type="line" position="day*value" size={2} />
              <Geom
                type="point"
                position="day*value"
                size={4}
                shape="circle"
                style={{
                  stroke: '#fff',
                  lineWidth: 1,
                }}
              />
            </Chart>
          </Card>
        </Col>
        <Col span={10}>
          <Card title="月销量走势" bordered>
            <Chart height={400} data={tableTwo} scale={colsTwo} forceFit>
              <Axis name="month" />
              <Axis name="value" />
              <Tooltip
                crosshairs={{
                  type: 'y',
                }}
              />
              <Geom type="line" position="month*value" size={2} />
              <Geom
                type="point"
                position="month*value"
                size={4}
                shape="circle"
                style={{
                  stroke: '#fff',
                  lineWidth: 1,
                }}
              />
            </Chart>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Table;
