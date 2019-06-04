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
          width={740}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="2" size="large" style={{ marginBottom: 32,paddingBottom:20 }}>
              <Description term="商家名称">{current.businessName}</Description>
              <Description term="联系人">{current.contacts}</Description>
              <Description term="联系方式">{current.phone}</Description>
              <Description term="商家地址">{current.address}</Description>
              <Description term="佣金比例">{current.commissionRate}</Description>
              <Description term="法人">{current.legalPerson}</Description>
              <Description term="法人身份证">{current.idCardUrl}</Description>
              <Description term="营业执照">{current.licenseUrl}</Description>
              <Description term="封面照片">{current.coverUrl}</Description>
              <Description term="入住时间">{current.checkinTime}</Description>
              <Description term="入住方式">{current.source}</Description>
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
