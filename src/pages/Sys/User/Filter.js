import { connect } from 'dva';
import  React,{ Component } from 'react';
import { Input, Form, Button, DatePicker, TreeSelect, Select } from 'antd';
import moment from 'moment';
import FilterItem from '@/components/FilterItem/FilterItem';

const { RangePicker } = DatePicker;
const { Option } = Select;


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
    if (searchParam.enterDate && searchParam.enterDate.length === 2) {
      searchParam.searchBeginTime = moment(searchParam.enterDate[0]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.searchEndTime = moment(searchParam.enterDate[1]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.enterDate = '';
    }
    searchParam.enterDate = '';
    const { dispatch } = this.props;
    const payload = {
      ...searchParam,
    };
    
    dispatch({ type: 'sysuser/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const { form: { resetFields },dispatch } = this.props;
    resetFields();
    dispatch({ type: 'sysuser/queryList', payload:{} });
  };

  // 获取表单内容
  getFieldsValue=()=>{
    const { form: { getFieldsValue } } = this.props;
    return getFieldsValue();
  }


  render() {
    const { form: { getFieldDecorator },orgList } = this.props;

    return (
      <div>
        <Form>
          <div className="filterItem">

            <FilterItem label="用户名:">
              {getFieldDecorator('userName', {
              })(<Input style={{ width: 200 }} placeholder='请输入用户名' />)}
            </FilterItem>

            <FilterItem label="姓名:">
              {getFieldDecorator('fullName', {
              })(<Input style={{ width: 200 }} placeholder='请输入姓名' />)}
            </FilterItem>

            <FilterItem label="工号:">
              {getFieldDecorator('workNum', {
              })(<Input style={{ width: 200 }} placeholder='请输入工号' />)}
            </FilterItem>
            
            <FilterItem label="手机号:">
              {getFieldDecorator('mobileNum', {
             })(<Input style={{ width: 200 }} placeholder='请输入手机号' />)}
            </FilterItem>

            <FilterItem label="邮箱:">
              {getFieldDecorator('email', {
             })(<Input style={{ width: 200 }} placeholder='请输入邮箱' />)}
            </FilterItem>

            <FilterItem label="所属机构:">
              {getFieldDecorator('srcOrgCode', {
             })(<TreeSelect
               showSearch
               allowClear
               style={{  width: 200 }}
               dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
               treeData={orgList}
               placeholder="请选择所属机构"
               filterTreeNode={(inputValue, treeNode) => {
                  return treeNode.props.title.indexOf(inputValue) > -1;
               }}
               treeDefaultExpandAll
             />)}
            </FilterItem>

            <FilterItem label="状态:">
              {getFieldDecorator('enabled', {
              })(
                <Select style={{ width: 200 }} placeholder="请选择状态">
                  <Option value>正常</Option>
                  <Option value={false}>冻结</Option>
                </Select>)}
            </FilterItem>

            <FilterItem type="rangePicker" label="入职时间:">
              {getFieldDecorator('enterDate')(
                <RangePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder={['开始时间', '结束时间']}
                />
              )}
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
