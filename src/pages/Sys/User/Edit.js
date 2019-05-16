import React, { Component } from 'react';
import { Input, Row, Col, Form, DatePicker, Button, Drawer, Spin } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 取消
  cancel = () => {
    const {
      form: { resetFields },
      onCancel,
    } = this.props;
    resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // 保存
  submitForm = () => {
    const {
      form: { validateFields, resetFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      const data = values;
      if (!err) {
        if (onOk) {
          if (data.addTime) {
            data.addTime = moment(data.addTime).format('YYYY-MM-DD HH:mm:ss');
          }
          if (data.updTime) {
            data.updTime = moment(data.updTime).format('YYYY-MM-DD HH:mm:ss');
          }

          onOk(data, resetFields);
        }
      }
    });
  };

  render() {
    const {
      editVisible,
      editTitle,
      loading,
      current,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Drawer
          maskClosable={false}
          width={740}
          title={editTitle}
          placement="right"
          closable={false}
          onClose={this.cancel}
          visible={editVisible}
        >
          <Spin spinning={loading}>
            <Form>
              <Row>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: current.id,
                  })(<Input />)}
                </FormItem>
                <Col span="12">
                  <FormItem label="编码:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: current.code,
                      rules: [{ required: true, message: '编码不能为空' }],
                    })(<Input style={{ maxWidth: 220 }} placeholder="请输入编码" />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="用户名:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [{ required: true, message: '用户名不能为空' }],
                    })(<Input style={{ maxWidth: 220 }} placeholder="请输入用户名" />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="创建时间:" {...formItemLayout}>
                    {getFieldDecorator('addTime', {
                      initialValue: current.addTime
                        ? moment(current.addTime, 'YYYY-MM-DD HH:mm:ss')
                        : '',
                      rules: [{ required: true, message: '创建时间不能为空' }],
                    })(
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: 220 }}
                        placeholder="请选择创建时间"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="修改时间:" {...formItemLayout}>
                    {getFieldDecorator('updTime', {
                      initialValue: current.updTime
                        ? moment(current.updTime, 'YYYY-MM-DD HH:mm:ss')
                        : '',
                      rules: [{ required: true, message: '修改时间不能为空' }],
                    })(
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: 220 }}
                        placeholder="请选择修改时间"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="新增备注:" {...formItemLayout}>
                    {getFieldDecorator('addMark', {
                      initialValue: current.addMark,
                      rules: [{ required: true, message: '新增备注不能为空' }],
                    })(<Input style={{ maxWidth: 220 }} placeholder="请输入新增备注" />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="更新者:" {...formItemLayout}>
                    {getFieldDecorator('updUserCode', {
                      initialValue: current.updUserCode,
                      rules: [{ required: true, message: '更新者不能为空' }],
                    })(<Input style={{ maxWidth: 220 }} placeholder="请输入更新者" />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="更新备注:" {...formItemLayout}>
                    {getFieldDecorator('updMark', {
                      initialValue: current.updMark,
                      rules: [{ required: true, message: '更新备注不能为空' }],
                    })(<Input style={{ maxWidth: 220 }} placeholder="请输入更新备注" />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Spin>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
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
