import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button,Drawer,Spin, } from 'antd';
import DictLabel from '@/components/Dict/DictLabel';

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
          width={740}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="2" size="large" style={{ marginBottom: 32,paddingBottom:20 }}>
              <Description term="机构名称">{current.name}</Description>
              <Description term="机构类型">{<DictLabel type="org_type" value={current.orgType} />}</Description>
              <Description term="负责人">{current.principalCode}</Description>
              <Description term="手机号">{current.mobileNum}</Description>
              <Description term="归属区域">{current.srcAreaId}</Description>
              <Description term="详细地址">{current.address}</Description>
              <Description term="上级机构编码">{current.supCode}</Description>
              <Description term="上级机构名称">{current.supName}</Description>
              <Description term="上级结构编码集合">{current.supCodes}</Description>
              <Description term="上级机构名称集合">{current.supNames}</Description>
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
