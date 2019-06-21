import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Form, Button, Drawer, Spin,TreeSelect,Radio,InputNumber    } from 'antd';
import EditList from './EditList'
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


@connect(({}) => ({}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.editList=React.createRef()
    this.state = {
      loading: false,
      apiList:[],
    };
  }

  componentDidMount() {
    const { dispatch, } = this.props
    this.setState({loading:true})
    dispatch({ type: 'sysmenu/loadApi' }).then(({code,result})=>{
      this.setState({ loading: false})
      if(code===10000 && result){
        this.setState({ apiList: result})
      }
    })
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
      if (!err) {
        const operations=this.editList.renderDate();
        let data = {
          id:values.id,
          supId: values.supId,
          name: values.name,
          url: values.url,
          sort: values.sort,
          showFlag: values.showFlag,
          operations,
          remark: values.remark,
        };
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

  checkUrl = (rule, value, callback) => {
    if (value && value.substring(0,1)!=="/") {
      callback('url需要 / 开头');
    } else {
      callback();
    }
  };



  render() {
    const {
      visible,
      current,
      title,
      menuTreeData,
      form,
      form: { getFieldDecorator },
    } = this.props;
    const { loading,apiList } = this.state;
    return (
      <div>
        <Drawer
          maskClosable={false}
          width={980}
          title={title === '1' ? '新增' : '修改'}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>
                {
                  title !== '1' &&
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('id', {
                      initialValue: current.id,
                    })(<Input />)}
                  </FormItem>
                }

                <Col span="12">
                  <FormItem label="上级菜单:" {...formItemLayout}>
                    {getFieldDecorator('supId', {
                      initialValue: current.supId,
                    })( <TreeSelect
                      disabled={title!=="1"}
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                      treeData={menuTreeData}
                      placeholder="请选择上级菜单"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="菜单名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [
                        { 'required': true, 'message': '菜单名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{  width: 250 }} placeholder='请输入菜单名称' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="URL:" {...formItemLayout}>
                    {getFieldDecorator('url', {
                      initialValue: current.url,
                      rules: [
                        { 'required': true, 'message': 'URL不能为空' },
                        { validator: this.checkUrl },
                      ],
                    })(<Input maxLength={256} style={{  width: 250 }} placeholder='请输入以/开头且与上下级层级一致的URL' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="排序:" {...formItemLayout}>
                    {getFieldDecorator('sort', {
                      initialValue: current.sort || current.sort===0 ? current.sort :10000,
                      rules: [],
                    })(<InputNumber precision={0} min={-9999999} max={999999999} style={{  width: 250 }} placeholder='请输入排序' />)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="显示:" {...formItemLayout}>
                    {getFieldDecorator('showFlag', {
                      initialValue: current.showFlag ? current.showFlag : '1',
                    })(
                      <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </Radio.Group>)}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="备注:" {...formItemLayout}>
                    {getFieldDecorator('remark', {
                      initialValue: current.remark,
                      rules: [],
                    })(<Input maxLength={256} style={{  width: 250 }} placeholder='请输入备注' />)}
                  </FormItem>
                </Col>
              </Row>
              {
                (current.operations || title==="1") &&
                <EditList selfRef={(_t)=>{this.editList=_t}} list={current.operations} apiList={apiList} form={form} />
              }
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Authorize code="SYS_MENU_EDIT">
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
