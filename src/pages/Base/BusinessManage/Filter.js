import { connect } from 'dva';
import  React,{ Component } from 'react';
import { Input,Form,Button, } from 'antd';

import FilterItem from '@/components/FilterItem/FilterItem';

@connect(({  }) => ({
  
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
    
    dispatch({ type: 'basebusinessManage/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const { form: { resetFields },dispatch } = this.props;
    resetFields();
    dispatch({ type: 'basebusinessManage/queryList', payload:{} });
  };

  // 获取表单内容
  getFieldsValue=()=>{
    const { form: { getFieldsValue } } = this.props;
    return getFieldsValue();
  };


  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div>
        <Form>
          <div className="filterItem">
            
            <FilterItem label="商家名称:">
              {getFieldDecorator('businessName', {
             })(<Input style={{ width: 200 }} placeholder='请输入商家名称' />)}
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
