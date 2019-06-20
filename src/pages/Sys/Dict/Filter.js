import { connect } from 'dva';
import React, { Component } from 'react';
import { Input, Select, Form, Button } from 'antd';

import FilterItem from '@/components/FilterItem/FilterItem';

const { Option } = Select;

@connect(({sysdict}) => ({
  allList:sysdict.allList
}))
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 查询
  searchHandle = () => {
    const searchParam = this.getFieldsValue();

    const { dispatch } = this.props;
    const payload = {
      ...searchParam,
    };

    dispatch({ type: 'sysdict/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const { form: { resetFields }, dispatch } = this.props;
    resetFields();
    dispatch({ type: 'sysdict/queryList', payload: {} });
  };

  // 获取表单内容
  getFieldsValue = () => {
    const { form: { getFieldsValue } } = this.props;
    return getFieldsValue();
  };


  render() {
    const { form: { getFieldDecorator } ,allList} = this.props;

    return (
      <div>
        <Form>
          <div className="filterItem">

            <FilterItem label="字典类型:">
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select style={{ width: 200 }}>
                  <Option value=''>全部</Option>
                  {
                    allList.map(item=>{
                       return <Option key={item.id} value={item.type}>{item.type}</Option>
                    })
                  }
                </Select>)}
            </FilterItem>

            <FilterItem label="字典标签:">
              {getFieldDecorator('dictKey', {})(<Input style={{ width: 200 }} placeholder='请输入字典标签' />)}
            </FilterItem>

            <FilterItem label="字典值:">
              {getFieldDecorator('dictValue', {})(<Input style={{ width: 200 }} placeholder='请输入字典值' />)}
            </FilterItem>

            <FilterItem label="备注:">
              {getFieldDecorator('remark', {})(<Input style={{ width: 200 }} placeholder='请输入备注' />)}
            </FilterItem>

            <FilterItem type="button">
              <Button type="primary" onClick={this.searchHandle}>
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.reSetHandle}>
                重置查询
              </Button>
            </FilterItem>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Filter);
