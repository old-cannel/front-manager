import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Form, Button, Drawer, Spin } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({}) => ({}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
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
    this.setState({ loading: true });
    const {
      form: { validateFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      const data = values;
      if (!err) {
        if (onOk) {
          onOk(data, () => {
            this.setState({ loading: false });
          });
        }
      } else {
        this.setState({ loading: false });
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
          width={550}
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
                <Col span="24">
                  <FormItem label="编号:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: current.code,
                      rules: [{ required: true, message: '编号不能为空' }],
                    })(
                      <Input
                        disabled
                        maxLength={64}
                        style={{ maxWidth: 200 }}
                        placeholder="请输入编号"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [{ required: true, message: '名称不能为空' }],
                    })(
                      <Input maxLength={100} style={{ maxWidth: 200 }} placeholder="请输入名称" />
                    )}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="路径:" {...formItemLayout}>
                    {getFieldDecorator('path', {
                      initialValue: current.path,
                      rules: [{ required: true, message: '路径不能为空' }],
                    })(
                      <Input maxLength={200} style={{ maxWidth: 200 }} placeholder="请输入路径" />
                    )}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="请求方法:" {...formItemLayout}>
                    {getFieldDecorator('requestMethod', {
                      initialValue: current.requestMethod ? current.requestMethod : '',
                      rules: [{ required: true, message: '请求方法不能为空' }],
                    })(
                      <Select
                        defaultValue=""
                        style={{ maxWidth: 200 }}
                        placeholder="请选择请求方法"
                      >
                        <Option value="">请选择</Option>
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button loading={loading} onClick={this.submitForm} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Edit);
