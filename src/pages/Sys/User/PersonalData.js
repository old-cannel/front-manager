import {
  Form,
  Input,
  Row,
  Col,
  Upload,
  Spin,
  message,
  Icon, Button,
} from 'antd';
import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FILE_DISPLAY_PREFIX, UPLOAD_URL } from '@/services/api';
import { connect } from 'dva';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@connect(({}) => ({}))
class PersonalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl:'',
      current:{},
      loading:false
    };
  }

  componentDidMount() {
     const {dispatch}=this.props
     this.setState({loading:true})
     dispatch({type:'sysuser/getUserInfo'}).then(({result})=>{
       this.setState({loading:false})
       this.setState({current:result})
     })
  }

  // 保存
  submitForm = () => {
    this.setState({ loading: true });
    const { form: { validateFields },dispatch } = this.props;
    const {imageUrl,current}=this.state
    validateFields((err, values) => {
      let data = values;
      if (!err) {
        data.userHeader= imageUrl || current.userHeader
        dispatch({type:'sysuser/update',payload:data}).then(({code,msg})=>{
          this.setState({loading:false})
          if(code===10000){
            message.success(msg)
            dispatch({type:'sysuser/getUserInfo'}).then(({result})=>{
              this.setState({loading:false})
              this.setState({current:result})
            })
          }
        })
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
      form: { getFieldDecorator },
    } = this.props;

    const {imageUrl,current,loading}=this.state
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}  />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <div className="pageContainer">
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: current.id,
                  })(<Input />)}
                </FormItem>


                <Col span="24">
                  <FormItem label="员工头像:" {...formItemLayout}>
                    {getFieldDecorator('userHeader', {
                      initialValue: current.userHeader,
                    })(
                      <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={UPLOAD_URL}
                        onChange={this.handleChange}
                      >
                        {(imageUrl || current.userHeader) ?
                          <img alt="员工头像" style={{ width: 100, height: 100, objectFit: 'cover' }} src={FILE_DISPLAY_PREFIX + (imageUrl || current.userHeader)} /> : uploadButton}
                      </Upload>)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                      initialValue: current.mobileNum,
                      rules: [
                        {
                          pattern: /^1[0123456789]\d{9}$/,
                          message: '请正确填写您的手机号码',
                        },
                      ],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入手机号' />)}
                  </FormItem>
                </Col>

                <Col span="24">
                  <FormItem label="邮箱:" {...formItemLayout}>
                    {getFieldDecorator('email', {
                      initialValue: current.email,
                      rules: [
                        {
                          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                          message: '请正确填写您的邮箱',
                        },
                      ],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入邮箱' />)}
                  </FormItem>
                </Col>
                <Col span="14" offset="10">
                  <Button loading={loading} onClick={this.submitForm} type="primary">
                    更新
                  </Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PersonalData);
