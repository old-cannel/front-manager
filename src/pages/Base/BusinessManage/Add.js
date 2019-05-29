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
class Add extends Component {
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
    this.setState({ loading: true });
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      const data = values;
      if (!err) {
        if (onOk) {
           if (data.checkinTime) {
            data.checkinTime = moment(data.checkinTime).format('YYYY-MM-DD HH:mm:ss');
          }

          onOk(data,()=>{this.setState({loading:false})});
        }
      }else{
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Drawer
          maskClosable={false}
          width={740}
          title="新增"
          placement="right"
          onClose={() => {
            onCancel();
          }}
          visible={visible}
        >
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>
                <Col span="12">
                  <FormItem label="用户id:" {...formItemLayout}>
                    {getFieldDecorator('userCode', {
                   rules:[
                      
                   ]
             })(<Input maxLength={64} style={{ maxWidth: 200 }} placeholder='请输入用户id' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="商家名称:" {...formItemLayout}>
                    {getFieldDecorator('businessName', {
                   rules:[
                      
                   ]
             })(<Input maxLength={100} style={{ maxWidth: 200 }} placeholder='请输入商家名称' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系人:" {...formItemLayout}>
                    {getFieldDecorator('contacts', {
                   rules:[
                      
                   ]
             })(<Input maxLength={50} style={{ maxWidth: 200 }} placeholder='请输入联系人' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系方式:" {...formItemLayout}>
                    {getFieldDecorator('phone', {
                   rules:[
                      
                   ]
             })(<Input maxLength={20} style={{ maxWidth: 200 }} placeholder='请输入联系方式' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="商家地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入商家地址' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="佣金比例:" {...formItemLayout}>
                    {getFieldDecorator('commissionRate', {
                   rules:[
                      
                   ]
             })(<Input maxLength={10} style={{ maxWidth: 200 }} placeholder='请输入佣金比例' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="法人:" {...formItemLayout}>
                    {getFieldDecorator('legalPerson', {
                   rules:[
                      
                   ]
             })(<Input maxLength={50} style={{ maxWidth: 200 }} placeholder='请输入法人' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="法人身份证:" {...formItemLayout}>
                    {getFieldDecorator('idCardUrl', {
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入法人身份证' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="营业执照:" {...formItemLayout}>
                    {getFieldDecorator('licenseUrl', {
                   rules:[
                      
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入营业执照' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="封面照片:" {...formItemLayout}>
                    {getFieldDecorator('coverUrl', {
                   rules:[
                      {"required":true,"message":"封面照片不能为空"}
                   ]
             })(<Input maxLength={200} style={{ maxWidth: 200 }} placeholder='请输入封面照片' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="入住时间:" {...formItemLayout}>
                    {getFieldDecorator('checkinTime', {
                   rules:[
                      
                   ]
             })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 200 }} placeholder='请选择入住时间' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="入住方式:" {...formItemLayout}>
                    {getFieldDecorator('source', {
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

export default Form.create()(Add);
