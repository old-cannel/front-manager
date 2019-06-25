import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button,Drawer,Spin, } from 'antd';

const { Description } = DescriptionList;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  // 返回关闭
  cancel = () => {
    const {onCancel } = this.props;
    if(onCancel){
      onCancel()
    }
  };


  render() {
    const {
      visible,
      current,
      loading
    } = this.props;


    return (
      <div>
        <Drawer
          title="详情"
          width={550}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="1" size="large" style={{ marginBottom: 32,paddingBottom:20 }} >
              <Description term="操作时间">{current.addTime}</Description>
              <Description term="操作人">{current.operationPerson}</Description>
              <Description term="操作描述">{current.name}</Description>
              <Description term="路径">{current.path}</Description>
              <Description term="请求方法">{current.requestMethod}</Description>
              <Description term="请求数据">{current.requestData}</Description>
              <Description term="响应数据">{current.responseData}</Description>
            </DescriptionList>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              返回
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Detail;
