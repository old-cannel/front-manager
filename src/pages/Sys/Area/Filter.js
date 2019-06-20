import { connect } from 'dva';
import  React,{ Component } from 'react';
import { Input,Select,Form,Button, } from 'antd';

import FilterItem from '@/components/FilterItem/FilterItem';

const  { Option }  =Select;

@connect(({ global }) => ({
 dictInfo:global.dictInfo
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
    
    dispatch({ type: 'sysarea/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const { form: { resetFields },dispatch } = this.props;
    resetFields();
    dispatch({ type: 'sysarea/queryList', payload:{} });
  };

  // 获取表单内容
  getFieldsValue=()=>{
    const { form: { getFieldsValue } } = this.props;
    return getFieldsValue();
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div>
        <Form>
          <div className="filterItem">
            
            <FilterItem label="区域名称:">
              {getFieldDecorator('name', {
             })(<Input style={{ width: 200 }} placeholder='请输入区域名称' />)}
            </FilterItem>

            <FilterItem label="区域编码:">
              {getFieldDecorator('code', {
              })(<Input style={{ width: 200 }} placeholder='请输入区域编码' />)}
            </FilterItem>

            <FilterItem label="区域类型:">
              {getFieldDecorator('type', {
                    initialValue:''
                })( 
                  <Select style={{ width: 200 }}>
                    <Option value=''>全部</Option>
                    {
               (this.props.dictInfo || []).filter(filterItem=>filterItem.type==='area_type').map(item=>{
              return  <Option key={item.value} value={item.value}>{item.label}</Option>
            })
            }
                  </Select>)}
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
