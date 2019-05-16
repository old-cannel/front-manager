import { connect } from 'dva';
import  React,{ Component } from 'react';
#{IMPORTANTD}

#{IMPORTDYNAMIC}
import FilterItem from '@/components/FilterItem/FilterItem';


#{CONSTANT}

@connect(({ }) => ({

}))
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //查询
  searchHandle = () => {
    const searchParam = this.getFieldsValue();
    #{DATEHANDLE}
    const { dispatch } = this.props;
    const payload = {
      ...searchParam,
    };
    dispatch({ type: '#{NAMESPACE}/queryList', payload });
  };

  //重置
  reSetHandle = () => {
    const { form: { resetFields },dispatch } = this.props;
    resetFields();
    dispatch({ type: '#{NAMESPACE}/queryList', payload:{} });
  };

  //获取表单内容
  getFieldsValue=()=>{
    const { form: { getFieldsValue } } = this.props;
    return getFieldsValue();
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div>
        <Form>
          <Row gutter={24}>
            #{IMPORTFILTERITEM}
            <Col xxl={{ span: 5 }} md={{ span: 5 }}>
              <FilterItem>
                <div style={{ minWidth: 170 }}>
                  <Button type="primary" onClick={this.searchHandle}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 20 }} onClick={this.reSetHandle}>
                    重置查询
                  </Button>
                </div>
              </FilterItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Filter);
