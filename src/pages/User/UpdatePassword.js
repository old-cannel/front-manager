import { Modal, Form, Input } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  formSubmit = () => {
    const {
      onOk,
      form: { validateFields, resetFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(values, resetFields);
      }
    });
  };

  checkPassword = (rule, value, callback) => {
    const {
      form: { getFieldsValue },
    } = this.props;
    if (value && value.length >= 6) {
      if (getFieldsValue().password !== value) {
        callback('确认密码不一致');
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator, resetFields },
      onCancel,
      confirmLoading,
      visible,
    } = this.props;

    return (
      <div>
        <Modal
          maskClosable={false}
          title="修改密码"
          confirmLoading={confirmLoading}
          visible={visible}
          onOk={() => {
            this.formSubmit();
          }}
          onCancel={() => {
            resetFields();
            onCancel();
          }}
        >
          <Form>
            <FormItem label="原密码" {...formItemLayout}>
              {getFieldDecorator('oldPassword', {
                rules: [
                  { required: true, message: '原密码不能为空' },
                  { min: 6, message: '密码长度最小6位' },
                ],
              })(<Input type="password" style={{ width: 260 }} maxLength={20} />)}
            </FormItem>
            <FormItem label="新密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '新密码不能为空' },
                  { min: 6, message: '新密码长度最小6位' },
                ],
              })(<Input type="password" style={{ width: 260 }} maxLength={20} />)}
            </FormItem>
            <FormItem label="确认密码" {...formItemLayout}>
              {getFieldDecorator('rePassword', {
                rules: [
                  { required: true, message: '确认密码不能为空' },
                  { min: 6, message: '确认密码长度最小6位' },
                  { validator: this.checkPassword },
                ],
              })(<Input type="password" style={{ width: 260 }} maxLength={20} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UpdatePassword);
