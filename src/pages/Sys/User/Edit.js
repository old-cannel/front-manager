import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Input,
  Row,
  Col,
  Form,
  Button,
  Drawer,
  Spin,
  TreeSelect,
  DatePicker,
  Select,
  Radio,
  Checkbox,
  Upload, Icon,
} from 'antd';
import moment from 'moment';
import { UPLOAD_URL ,FILE_DISPLAY_PREFIX} from '../../../services/api';


const {TextArea}=Input
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

const formItemLayout24 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};


@connect(({}) => ({}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl:''
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
    const { form: { validateFields }, onOk,current } = this.props;
    const {imageUrl}=this.state
    validateFields((err, values) => {
      let data = values;
      if (!err) {
        if (onOk) {
          if(data.entryTime){
            data.entryTime= moment(data.entryTime).format('YYYY-MM-DD HH:mm:ss')
          }
          data.userHeader= imageUrl || current.userHeader
          onOk(data, () => {
            this.setState({ loading: false });
          });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done' && info.file.response.code===10000) {
      this.setState({imageUrl: info.file.response.result[0]})
    }
  };

  render() {
    const {
      visible,
      current,
      checkWorkNum,
      checkUserName,
      orgList,
      roleList,
      form: { getFieldDecorator},
    } = this.props;
    const { loading,imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Drawer
          maskClosable={false}
          width={900}
          title="修改"
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>

                <FormItem style={{display:'none'}} label="工号:" {...formItemLayout}>
                  {getFieldDecorator('id', {
                    initialValue:current.id,
                  })(<Input />)}
                </FormItem>


                <Col span="12">
                  <FormItem label="工号:" {...formItemLayout}>
                    {getFieldDecorator('workNum', {
                      initialValue:current.workNum,
                      rules: [
                        { 'required': true, 'message': '工号不能为空' },
                        { validator: (rule, value, callback)=>{checkWorkNum(rule, value, callback,current.id)} },
                      ],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入工号'  />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="员工头像:" {...formItemLayout}>
                    {getFieldDecorator('userHeader', {
                      initialValue:current.userHeader,
                    })(
                      <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={UPLOAD_URL}
                        onChange={this.handleChange}
                      >
                        {(imageUrl || current.userHeader) ? <img alt="员工头像" style={{width:100,height:100,objectFit: "cover"}} src={FILE_DISPLAY_PREFIX+(imageUrl || current.userHeader)} /> : uploadButton}
                      </Upload>)}
                  </FormItem>
                </Col>


                <Col span="12">
                  <FormItem label="用户名:" {...formItemLayout}>
                    {getFieldDecorator('userName', {
                      initialValue:current.userName,
                      rules: [
                        { 'required': true, 'message': '用户名不能为空' },
                        { validator: (rule, value, callback)=>checkUserName(rule, value, callback,current.id) },
                      ],
                    })(<Input maxLength={50} style={{ width: 250 }} placeholder='请输入用户名' />)}
                  </FormItem>
                </Col>


                <Col span="12">
                  <FormItem label="姓名:" {...formItemLayout}>
                    {getFieldDecorator('fullName', {
                      initialValue:current.fullName,
                      rules: [
                        { 'required': true, 'message': '姓名不能为空' },
                      ],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入用姓名' />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="身份证号:" {...formItemLayout}>
                    {getFieldDecorator('idNum', {
                      initialValue:current.idNum,
                    })(<Input maxLength={18} style={{ width: 250 }} placeholder='请输入身份证号' />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                      initialValue: current.mobileNum,
                      rules: [
                        { pattern: /^1[0123456789]\d{9}$/,
                          message: '请正确填写您的手机号码',
                        }
                      ],
                    })(<Input maxLength={20} style={{  width: 250 }} placeholder='请输入手机号'  />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="邮箱:" {...formItemLayout}>
                    {getFieldDecorator('email', {
                      initialValue: current.email,
                      rules: [
                        {
                          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                          message: '请正确填写您的邮箱',
                        },
                      ],
                    })(<Input maxLength={20} style={{  width: 250 }} placeholder='请输入邮箱'  />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="所属机构:" {...formItemLayout}>
                    {getFieldDecorator('srcOrgCode', {
                      initialValue: current.srcOrgCode || null,
                    })( <TreeSelect
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                      treeData={orgList}
                      placeholder="请选择所属机构"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="岗位:" {...formItemLayout}>
                    {getFieldDecorator('position', {
                      initialValue: current.position
                    })(<Input maxLength={20} style={{  width: 250 }} placeholder='请输入岗位'  />)}
                  </FormItem>
                </Col>

                <Col span="12">
                  <FormItem label="入职时间:" {...formItemLayout}>
                    {getFieldDecorator('entryTime', {
                     initialValue:current.entryTime ? moment(current.entryTime, 'YYYY-MM-DD HH:mm:ss'):null
                    })( <DatePicker
                      style={{ width: 250 }}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime
                    />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="状态:" {...formItemLayout}>
                    {getFieldDecorator('enabled', {
                      initialValue:current.enabled
                    })(
                      <Select style={{ width: 250 }}>
                        <Option value>正常</Option>
                        <Option value={false}>冻结</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>


                <Col span={24}>
                  <FormItem label="超级管理员" {...formItemLayout24}>
                    {getFieldDecorator('adminFlag', {
                      initialValue:current.adminFlag || "0"
                    })(
                      <Radio.Group>
                        <Radio value="0">否</Radio>
                        <Radio value="1">是</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>

                <Col span={24}>
                  <FormItem label="用户角色" {...formItemLayout24}>
                    {getFieldDecorator('roles', {
                      initialValue:current.roles || []
                    })(
                      <Checkbox.Group>
                        {roleList.map(item => {
                          return (
                            <Checkbox key={item.id} value={item.id}>
                              {item.name}
                            </Checkbox>
                          );
                        })}
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>

                <Col span={24}>
                  <FormItem label="备注:" {...formItemLayout24}>
                    {getFieldDecorator('remark', {
                      initialValue:current.remark,
                    })(<TextArea style={{width:680}} rows={4} maxLength={250} placeholder="请输入备注"  />)}
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
