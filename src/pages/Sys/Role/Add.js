import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Form, Button, Drawer, Spin,Select } from 'antd';
import MenuTree from './MenuTree'

const FormItem = Form.Item;
const {Option}=Select

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
    this.menuTree=React.createRef();
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
          data.menuIds=this.menuTree.renderDate()
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
                  <FormItem label="角色名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [
                        { 'required': true, 'message': '角色名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{ maxWidth: 200 }} placeholder='请输入角色名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('status', {
                      initialValue:'1',
                      rules: [
                        { 'required': true, 'message': '状态不能为空' },
                      ],
                    })(
                      <Select style={{ maxWidth: 200 }}>
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                      </Select>)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="菜单:" {...formItemLayout}>
                    {getFieldDecorator('menus', {
                    })(<MenuTree onRef={(_t)=>{this.menuTree=_t}} />)}
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
