import React, { Component } from 'react';
#{IMPORTANTD}
#{IMPORTDYNAMIC}


#{CONSTANT}

let saveLoading=false
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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
    saveLoading=true
    setTimeout(()=>{saveLoading=false},1000)
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
            <Form style={{paddingBottom:15}}>
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
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button loading={loading || saveLoading} onClick={this.submitForm} type="primary">
              保存
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Edit);
