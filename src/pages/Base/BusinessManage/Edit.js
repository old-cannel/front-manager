import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Row,Col,Form,DatePicker,Button,Drawer,Spin, } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
@connect(({  }) => ({
  
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
    this.setState({loading:true});
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      const data = values;
      if (!err) {
        if (onOk) {
           if (data.checkinTime) {
            data.checkinTime = moment(data.checkinTime).format('YYYY-MM-DD HH:mm:ss');
          }

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
                  <FormItem label="商家名称:" {...formItemLayout}>
                    {getFieldDecorator('businessName', {
                initialValue:current.businessName,
                   rules:[
                      
                   ]
             })(<Input maxLength={100} style={{ maxWidth: 200 }} placeholder='请输入商家名称' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系人:" {...formItemLayout}>
                    {getFieldDecorator('contacts', {
                initialValue:current.contacts,
                   rules:[
                      
                   ]
             })(<Input maxLength={50} style={{ maxWidth: 200 }} placeholder='请输入联系人' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系方式:" {...formItemLayout}>
                    {getFieldDecorator('phone', {
                initialValue:current.phone,
                   rules:[
                      
                   ]
             })(<Input maxLength={20} style={{ maxWidth: 200 }} placeholder='请输入联系方式' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="商家地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                initialValue:current.address,
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入商家地址' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="佣金比例:" {...formItemLayout}>
                    {getFieldDecorator('commissionRate', {
                initialValue:current.commissionRate,
                   rules:[
                      
                   ]
             })(<Input maxLength={10} style={{ maxWidth: 200 }} placeholder='请输入佣金比例' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="法人:" {...formItemLayout}>
                    {getFieldDecorator('legalPerson', {
                initialValue:current.legalPerson,
                   rules:[
                      
                   ]
             })(<Input maxLength={50} style={{ maxWidth: 200 }} placeholder='请输入法人' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="法人身份证:" {...formItemLayout}>
                    {getFieldDecorator('idCardUrl', {
                initialValue:current.idCardUrl,
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入法人身份证' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="营业执照:" {...formItemLayout}>
                    {getFieldDecorator('licenseUrl', {
                initialValue:current.licenseUrl,
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入营业执照' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="封面照片:" {...formItemLayout}>
                    {getFieldDecorator('coverUrl', {
                initialValue:current.coverUrl,
                   rules:[
                      {"required":true,"message":"封面照片不能为空"}
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入封面照片' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="入住时间:" {...formItemLayout}>
                    {getFieldDecorator('checkinTime', {
                initialValue:current.checkinTime? moment(current.checkinTime, 'YYYY-MM-DD HH:mm:ss') : '',
                   rules:[
                      
                   ]
             })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 200 }} placeholder='请选择入住时间' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="入住方式:" {...formItemLayout}>
                    {getFieldDecorator('source', {
                initialValue:current.source,
                   rules:[
                      
                   ]
             })(<Input maxLength={1} style={{ maxWidth: 200 }} placeholder='请输入入住方式' />)}
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
