import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Form, Button, Drawer, Spin, InputNumber } from 'antd';

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
      let data = values;
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

  checkType = (rule, value, callback) => {
    if (value) {
      const { dispatch } = this.props;
      dispatch({
        type: 'sysdict/checkType',
        payload: { type: value, id: '' },
      }).then(({ result }) => {
        if (result > 0) {
          callback('类型已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
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
          width={550}
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
                <Col span="24">
                  <FormItem label="字典类型:" {...formItemLayout}>
                    {getFieldDecorator('type', {
                      initialValue: '',
                      rules: [
                        { 'required': true, 'message': '字典类型不能为空' },
                        { validator: this.checkType },
                      ],
                    })(
                      <Input maxLength={10} style={{ width: 230 }} placeholder='请输入字典类型' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="字典标签:" {...formItemLayout}>
                    {getFieldDecorator('dictKey', {
                      rules: [
                        { 'required': true, 'message': '字典标签不能为空' },
                      ],
                    })(<Input maxLength={10} style={{ width: 230 }} placeholder='请输入字典标签' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="字典值:" {...formItemLayout}>
                    {getFieldDecorator('dictValue', {
                      rules: [
                        { 'required': true, 'message': '字典值不能为空' },
                      ],
                    })(<Input maxLength={50} style={{ width: 230 }} placeholder='请输入字典值' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="排序:" {...formItemLayout}>
                    {getFieldDecorator('sort', {
                      rules: [
                        { 'required': true, 'message': '排序不能为空' },
                      ],
                    })(<InputNumber precision={0} min={-9999999} max={999999999} style={{  width: 230 }} placeholder='请输入排序' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="备注:" {...formItemLayout}>
                    {getFieldDecorator('remark', {
                      rules: [],
                    })(<Input maxLength={100} style={{ width: 230 }} placeholder='请输入备注' />)}
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

export default Form.create()(Add);
