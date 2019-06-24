import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Form, Button, Drawer, Spin, Select } from 'antd';
import MenuTree from './MenuTree'
import Authorize from '@/components/Authorize/Authorize'

const {Option}=Select
const FormItem = Form.Item;

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
      current,
      roleId,
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
                  <FormItem label="角色名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [
                        { 'required': true, 'message': '角色名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{ maxWidth: 200 }} placeholder='请输入角色名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('status', {
                      initialValue: current.status,
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
                    })(
                      <MenuTree
                        roleId={roleId}
                        onRef={(_t)=>{this.menuTree=_t}}
                      />)}
                  </FormItem>
                </Col>

              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Authorize code="SYS_ROLE_UPDATE">
              <Button loading={loading} onClick={this.submitForm} type="primary">
                保存
              </Button>
            </Authorize>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Edit);
