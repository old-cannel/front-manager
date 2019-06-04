import { connect } from 'dva';
import React, { Component } from 'react';
import { Input, Row, Col, Form, DatePicker, Button } from 'antd';

import moment from 'moment';

import FilterItem from '@/components/FilterItem/FilterItem';

const { RangePicker } = DatePicker;

@connect(({}) => ({}))
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 查询
  searchHandle = () => {
    const searchParam = this.getFieldsValue();
    if (searchParam.addTime && searchParam.addTime.length === 2) {
      searchParam.addTimeSearch = [];
      searchParam.addTimeSearch[0] = moment(searchParam.addTime[0]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.addTimeSearch[1] = moment(searchParam.addTime[1]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.addTime = '';
    }
    if (searchParam.updTime && searchParam.updTime.length === 2) {
      searchParam.updTimeSearch = [];
      searchParam.updTimeSearch[0] = moment(searchParam.updTime[0]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.updTimeSearch[1] = moment(searchParam.updTime[1]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.updTime = '';
    }

    const { dispatch } = this.props;
    const payload = {
      ...searchParam,
    };
    dispatch({ type: 'systest/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const {
      form: { resetFields },
      dispatch,
    } = this.props;
    resetFields();
    dispatch({ type: 'systest/queryList', payload: {} });
  };

  // 获取表单内容
  getFieldsValue = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    return getFieldsValue();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Form>
          <Row gutter={24}>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="编码:">
                {getFieldDecorator('code', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入编码" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="用户名:">
                {getFieldDecorator('name', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入用户名" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="创建者:">
                {getFieldDecorator('addUserCode', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入创建者" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="新增备注:">
                {getFieldDecorator('addMark', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入新增备注" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="更新者:">
                {getFieldDecorator('updUserCode', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入更新者" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 7 }} md={{ span: 7 }}>
              <FilterItem label="更新备注:">
                {getFieldDecorator('updMark', {})(
                  <Input style={{ maxWidth: 240 }} placeholder="请输入更新备注" />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 9 }} md={{ span: 9 }}>
              <FilterItem label="创建时间:">
                {getFieldDecorator('addTime', {})(
                  <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ maxWidth: 350 }} />
                )}
              </FilterItem>
            </Col>
            <Col xxl={{ span: 9 }} md={{ span: 9 }}>
              <FilterItem label="修改时间:">
                {getFieldDecorator('updTime', {})(
                  <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ maxWidth: 350 }} />
                )}
              </FilterItem>
            </Col>

            <Col xxl={{ span: 5 }} md={{ span: 5 }}>
              <FilterItem>
                <div style={{ minWidth: 170 }}>
                  <Button type="primary" onClick={this.searchHandle}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 20 }} onClick={this.reSetHandle}>
                    重置查询
                  </Button>
                </div>
              </FilterItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Filter);
