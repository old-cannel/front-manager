import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Form, Button, Drawer, Spin, TreeSelect } from 'antd';

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

@connect(({ global,sysorganization }) => ({
  dictInfo: global.dictInfo,
  list:sysorganization.list
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

  render() {
    const {
      visible,
      onCancel,
      list,
      form: { getFieldDecorator },
    } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Drawer
          maskClosable={false}
          width={600}
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
                  <FormItem label="上级机构:" {...formItemLayout}>
                    {getFieldDecorator('supCode', {
                      initialValue: '',
                    })( <TreeSelect
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                      treeData={list}
                      placeholder="请选择上级菜单"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="机构名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [
                        { 'required': true, 'message': '机构名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{  width: 250 }} placeholder='请输入机构名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="机构类型:" {...formItemLayout}>
                    {getFieldDecorator('orgType', {
                      initialValue: '',
                      rules: [
                        { 'required': true, 'message': '机构类型不能为空' },
                      ],
                    })(
                      <Select defaultValue='' style={{  width: 250 }} placeholder='请选择机构类型'>
                        <Option value=''>请选择</Option>
                        {
                          (this.props.dictInfo || []).filter(filterItem => filterItem.type === 'org_type').map(item => {
                            return <Option key={item.value} value={item.value}>{item.label}</Option>;
                          })
                        }
                      </Select>)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="负责人:" {...formItemLayout}>
                    {getFieldDecorator('principal', {
                      rules: [],
                    })(<Input maxLength={20} style={{  width: 250 }} placeholder='请输入负责人' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                      rules: [],
                    })(<Input maxLength={20} style={{  width: 250 }} placeholder='请输入手机号' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="归属区域:" {...formItemLayout}>
                    {getFieldDecorator('srcAreaId', {
                      rules: [],
                    })(<Input maxLength={32} style={{  width: 250 }} placeholder='请输入归属区域' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="详细地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                      rules: [],
                    })(<Input maxLength={100} style={{  width: 250 }} placeholder='请输入详细地址' />)}
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
