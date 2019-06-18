import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Select,Row,Col,Form,Button,Drawer,Spin, } from 'antd';

const FormItem = Form.Item;
const  { Option }  =Select;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
@connect(({ global }) => ({
 dictInfo:global.dictInfo
}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  // 取消
  cancel = () => {
    const { form: { resetFields }, onCancel } = this.props;
    resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // 保存
  submitForm = () => {
    this.setState({loading:true})
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      let data = values;
      if (!err) {
        if (onOk) {
          
          onOk(data, ()=>{this.setState({loading:false})});
        }
      }else{
        this.setState({loading:false})
      }
    });
  };

  render() {
    const {
      visible,
      current,
      form: { getFieldDecorator },
    } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <Drawer
          maskClosable={false}
          width={740}
          title="修改"
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: current.id,
                  })(<Input />)}
                </FormItem>
                <Col span="12">
                  <FormItem label="机构名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                initialValue:current.name,
                   rules:[
                      {"required":true,"message":"机构名称不能为空"}
                   ]
             })(<Input maxLength={30} style={{ maxWidth: 200 }} placeholder='请输入机构名称' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="机构类型:" {...formItemLayout}>
                    {getFieldDecorator('orgType', {
              initialValue:current.orgType?current.orgType:'',
                   rules:[
                      {"required":true,"message":"机构类型不能为空"}
                   ]
             })(
               <Select defaultValue='' style={{ maxWidth: 200 }} placeholder='请选择机构类型'>
                 <Option value=''>请选择</Option>
                 {
               (this.props.dictInfo || []).filter(filterItem=>filterItem.type==='org_type').map(item=>{
              return  <Option key={item.value} value={item.value}>{item.label}</Option>
            })
            }
               </Select>)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="负责人:" {...formItemLayout}>
                    {getFieldDecorator('principal', {
                initialValue:current.principal,
                   rules:[
                      
                   ]
             })(<Input maxLength={20} style={{ maxWidth: 200 }} placeholder='请输入负责人' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                initialValue:current.mobileNum,
                   rules:[
                      
                   ]
             })(<Input maxLength={20} style={{ maxWidth: 200 }} placeholder='请输入手机号' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="归属区域:" {...formItemLayout}>
                    {getFieldDecorator('srcAreaId', {
                initialValue:current.srcAreaId,
                   rules:[
                      
                   ]
             })(<Input maxLength={32} style={{ maxWidth: 200 }} placeholder='请输入归属区域' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="详细地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                initialValue:current.address,
                   rules:[
                      
                   ]
             })(<Input maxLength={100} style={{ maxWidth: 200 }} placeholder='请输入详细地址' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="上级机构编码:" {...formItemLayout}>
                    {getFieldDecorator('supCode', {
                initialValue:current.supCode,
                   rules:[
                      
                   ]
             })(<Input maxLength={100} style={{ maxWidth: 200 }} placeholder='请输入上级机构编码' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="上级机构名称:" {...formItemLayout}>
                    {getFieldDecorator('supName', {
                initialValue:current.supName,
                   rules:[
                      
                   ]
             })(<Input maxLength={30} style={{ maxWidth: 200 }} placeholder='请输入上级机构名称' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="上级结构编码集合:" {...formItemLayout}>
                    {getFieldDecorator('supCodes', {
                initialValue:current.supCodes,
                   rules:[
                      
                   ]
             })(<Input maxLength={1000} style={{ maxWidth: 200 }} placeholder='请输入上级结构编码集合' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="上级机构名称集合:" {...formItemLayout}>
                    {getFieldDecorator('supNames', {
                initialValue:current.supNames,
                   rules:[
                      
                   ]
             })(<Input maxLength={300} style={{ maxWidth: 200 }} placeholder='请输入上级机构名称集合' />)}
                  </FormItem>
                </Col>

              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submitForm} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Edit);
