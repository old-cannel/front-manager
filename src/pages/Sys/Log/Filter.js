import { connect } from 'dva';
import  React,{ Component } from 'react';
import { Input, Form, Button, DatePicker } from 'antd';
import moment from 'moment';
import FilterItem from '@/components/FilterItem/FilterItem';


const { RangePicker } = DatePicker;
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
    if (searchParam.addTime && searchParam.addTime.length === 2) {
      searchParam.searchBeginTime = moment(searchParam.addTime[0]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.searchEndTime = moment(searchParam.addTime[1]).format('YYYY-MM-DD HH:mm:ss');
      searchParam.addTime = '';
    }
    searchParam.addTime = '';
    const { dispatch } = this.props;
    const payload = {
      ...searchParam,
    };
    
    dispatch({ type: 'syslog/queryList', payload });
  };

  // 重置
  reSetHandle = () => {
    const { form: { resetFields },dispatch } = this.props;
    resetFields();
    dispatch({ type: 'syslog/queryList', payload:{} });
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
            
            <FilterItem label="API名称:">
              {getFieldDecorator('name', {
             })(<Input style={{ width: 200 }} placeholder='请输入API名称' />)}
            </FilterItem>

            <FilterItem label="操作人:">
              {getFieldDecorator('operationPerson', {
             })(<Input style={{ width: 200 }} placeholder='请输入操作人' />)}
            </FilterItem>


            <FilterItem type="rangePicker" label="操作时间:">
              {getFieldDecorator('addTime')(
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
