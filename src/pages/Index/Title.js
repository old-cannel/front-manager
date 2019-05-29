import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';

@connect(({}) => ({}))
class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'index/getData' });
  }

  render() {
    const { index } = this.props;
    return (
      <Row gutter={20}>
        <Col span={20}>
          <Card title="数据统计" bordered={false}>
            <p>会员数量：{index.memberCount}人</p>
            <p>商家数量：{index.orderCount}家</p>
            <p>成交订单数量：{index.businessCount}单</p>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Title;
