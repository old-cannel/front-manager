import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Form, Button, Drawer, Spin, TreeSelect } from 'antd';
import Authorize from '@/components/Authorize/Authorize'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ global, sysarea }) => ({
  dictInfo: global.dictInfo,
  allList: sysarea.allList,
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

          onOk(data, () => {
            this.setState({ loading: false });
          });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  checkCode=(rule, value, callback,id)=>{
    if(value){
      const { dispatch } = this.props;
      dispatch({
        type: 'sysarea/checkCode',
        payload: { code:value, id },
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
      current,
      allList,
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
                  <FormItem label="上级区域:" {...formItemLayout}>
                    {getFieldDecorator('supId', {
                      initialValue: current.supId || null,
                    })(<TreeSelect
                      disabled
                      showSearch
                      allowClear
                      style={{ width: 250 }}
                      dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                      treeData={allList}
                      placeholder="请选择上级区域"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll />)}
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="区域编码:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: current.code ,
                      rules: [
                        { 'required': true, 'message': '区域编码不能为空' },
                        { validator: (rule, value, callback)=>this.checkCode(rule, value, callback,current.id) },
                      ],
                    })(<Input maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入区域编码' />)}
                  </FormItem>

                  <FormItem label="区域名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name ,
                      rules: [
                        { 'required': true, 'message': '区域名称不能为空' },
                      ],
                    })(<Input maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入区域名称' />)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="备注:" {...formItemLayout}>
                    {getFieldDecorator('remark', {
                      initialValue: current.remark,
                      rules: [],
                    })(<Input maxLength={100} style={{ width: 250 }} placeholder='请输入备注' />)}
                  </FormItem>
                </Col>

              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Authorize code="SYS_AREA_UPDATE">
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
