import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Form, Button, Drawer, Spin, TreeSelect, Cascader } from 'antd';

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

@connect(({ global }) => ({
  dictInfo: global.dictInfo,
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
    this.setState({ loading: true });
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      let data = values;
      if (!err) {
        if (onOk) {
          if(data.srcAreaCode &&  data.srcAreaCode.length>0){
            data.srcAreaCode=data.srcAreaCode[data.srcAreaCode.length-1]
          }else{
            data.srcAreaCode=""
          }
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
      allList,
      optionsArea,
      form: { getFieldDecorator,getFieldsValue },
    } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <Drawer
          maskClosable={false}
          width={600}
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
                  <FormItem label="上级机构:" {...formItemLayout}>
                    {getFieldDecorator('supCode', {
                      initialValue: current.supCode || null,
                    })( <TreeSelect
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                      treeData={allList}
                      placeholder="请选择上级机构"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="机构编号:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: current.code ? ( current.code.replace(getFieldsValue().supCode,"")) :null,
                      rules: [
                        { 'required': true, 'message': '机构编号不能为空' },
                        { validator: this.checkCode },
                      ],
                    })(<Input addonBefore={getFieldsValue().supCode} maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入机构编号' />)}
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="机构名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [
                        { 'required': true, 'message': '机构名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{ width: 250 }} placeholder='请输入机构名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="机构类型:" {...formItemLayout}>
                    {getFieldDecorator('orgType', {
                      initialValue: current.orgType ? current.orgType : '',
                      rules: [
                        { 'required': true, 'message': '机构类型不能为空' },
                      ],
                    })(
                      <Select defaultValue='' style={{ width: 250 }} placeholder='请选择机构类型'>
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
                    {getFieldDecorator('principalCode', {
                      initialValue: current.principalCode,
                      rules: [],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入负责人' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                      initialValue: current.mobileNum,
                      rules: [ { pattern: /^1[0123456789]\d{9}$/,
                        message: '请正确填写您的手机号码!',
                      }],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入手机号' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="归属区域:" {...formItemLayout}>
                    {getFieldDecorator('srcAreaCode', {
                      initialValue: current.srcAreaCode? current.srcAreaCode.split(","):[],
                    })(<Cascader
                      options={optionsArea}
                      changeOnSelect
                      fieldNames={{ label: 'name', value: 'code', children: 'children' }}
                      style={{  width: 250 }}
                      placeholder='请选择归属区域' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="详细地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                      initialValue: current.address,
                      rules: [],
                    })(<Input maxLength={100} style={{ width: 250 }} placeholder='请输入详细地址' />)}
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
