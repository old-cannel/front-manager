import React, { Component } from 'react';
#{IMPORTANTD}
#{IMPORTDYNAMIC}


#{CONSTANT}


const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  //取消
  cancel = () => {
    const { form: { resetFields }, onCancel } = this.props;
    resetFields();
    if (onCancel) {
      onCancel();
    }

  };

  //保存
  submitForm = () => {
    const { form: { validateFields, resetFields }, onOk } = this.props;
    validateFields((err, values) => {
      let data=values
      if (!err) {
        if (onOk) {
          #{DATEHANDLE}
          onOk(data, resetFields);
        }
      }
    });
  };


  render() {
    const {
      editVisible,
      editTitle,
      loading,
      current,
      form: { getFieldDecorator },
    } = this.props;


    return (
      <div>
        <Drawer
          maskClosable={false}
          width={#{DRAWERWIDTH}}
          title={editTitle}
          placement="right"
          onClose={this.cancel}
          visible={editVisible}
        >
          <Spin spinning={loading}>
            <Form>
              <Row>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: current.id,
                  })(<Input/>)}
                </FormItem>
                #{IMPORTFILTERITEM}
              </Row>
            </Form>
          </Spin>
          <div style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}>
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
