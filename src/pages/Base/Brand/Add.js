import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Form, Button, Drawer, Spin, Upload, Icon, message } from 'antd';
import Api from '@/services/api';

const FormItem = Form.Item;

const { IMG_API, IMG_PATH } = Api.upload;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function beforeUpload(file) {
  const isJPG =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/gif';
  if (!isJPG) {
    message.error('图片格式不正确!');
    return isJPG;
  }
  return isJPG;
}

@connect(({}) => ({}))
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      thumbnail: '',
      imgLoading: false,
    };
  }

  // 取消
  cancel = () => {
    const {
      form: { resetFields },
      onCancel,
    } = this.props;
    resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // 保存
  submitForm = () => {
    this.setState({ loading: true });
    const {
      form: { validateFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      const data = values;
      const { thumbnail } = this.state;
      data.brandUrl = thumbnail;
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
      form: { getFieldDecorator },
    } = this.props;
    const { loading, thumbnail, imgLoading } = this.state;

    const uploadButton = (
      <div>
        <Icon type={imgLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ imgLoading: true });
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 10000) {
          this.setState({
            imgLoading: false,
            thumbnail: info.file.response.result[0],
          });
        } else if (info.file.response.code === 9999) {
          this.setState({ imgLoading: false });
          message.error('图片宽高比不正确，请重新选择');
        } else {
          this.setState({ imgLoading: false });
          message.error('上传图片失败!');
        }
      }
    };
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
                  <FormItem label="品牌名称:" {...formItemLayout}>
                    {getFieldDecorator('brandName', {
                      rules: [{ required: true, message: '品牌名称不能为空' }],
                    })(
                      <Input
                        maxLength={50}
                        style={{ maxWidth: 200 }}
                        placeholder="请输入品牌名称"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="排序:" {...formItemLayout}>
                    {getFieldDecorator('sort', {
                      rules: [],
                    })(<Input maxLength={11} style={{ maxWidth: 200 }} placeholder="请输入排序" />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="品牌商标:" {...formItemLayout}>
                    {getFieldDecorator('brandUrl', {
                      rules: [],
                    })(
                      <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={IMG_API}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                      >
                        {thumbnail ? <img src={`${IMG_PATH}${thumbnail}`} alt="" /> : uploadButton}
                      </Upload>
                    )}
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

export default Form.create()(Add);
