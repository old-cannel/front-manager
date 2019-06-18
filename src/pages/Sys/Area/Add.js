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

@connect(({ global }) => ({
  dictInfo: global.dictInfo,
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

  checkCode=(rule, value, callback)=>{
      if(value){
        const { dispatch, form: { getFieldsValue } } = this.props;
        dispatch({
          type: 'sysarea/checkCode',
          payload: { code:getFieldsValue().supCode+getFieldsValue().code, id: getFieldsValue().id ? getFieldsValue().id : '' },
        }).then(({ result }) => {
          if (result > 0) {
            callback('编码已经存在');
          } else {
            callback();
          }
        });
      }else{
        callback();
      }
  }

  render() {
    const {
      visible,
      onCancel,
      editLoading,
      allList,
      supCode,
      form: { getFieldDecorator,getFieldsValue },
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
          <Spin spinning={loading || editLoading}>
            <Form>
              <Row>
                <Col span="24">
                  <FormItem label="上级区域:" {...formItemLayout}>
                    {getFieldDecorator('supCode', {
                      initialValue: supCode || null,
                    })( <TreeSelect
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                      treeData={allList}
                      placeholder="请选择上级区域"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="区域编码:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      rules: [
                        { 'required': true, 'message': '区域编码不能为空' },
                        { validator: this.checkCode },
                      ],
                    })(<Input addonBefore={getFieldsValue().supCode} maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入区域编码' />)}
                  </FormItem>

                  <FormItem label="区域名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [
                        { 'required': true, 'message': '区域名称不能为空' },
                      ],
                    })(<Input maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入区域名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="备注:" {...formItemLayout}>
                    {getFieldDecorator('remark', {
                      rules: [],
                    })(<Input maxLength={100} style={{ maxWidth: 250 }} placeholder='请输入备注' />)}
                  </FormItem>
                </Col>

              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button loading={loading || editLoading} onClick={this.submitForm} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Add);
