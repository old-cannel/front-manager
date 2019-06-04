import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button, Drawer, Spin } from 'antd';

const { Description } = DescriptionList;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  // 返回关闭
  cancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const { detailVisible, current, loading } = this.props;

    return (
      <div>
        <Drawer
          title="详情"
          width={740}
          placement="right"
          onClose={this.cancel}
          visible={detailVisible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="2" size="large" style={{ marginBottom: 32, paddingBottom: 20 }}>
              <Description term="编码">{current.code}</Description>
              <Description term="用户名">{current.name}</Description>
              <Description term="创建时间">{current.addTime}</Description>
              <Description term="修改时间">{current.updTime}</Description>
              <Description term="创建者">{current.addUserCode}</Description>
              <Description term="新增备注">{current.addMark}</Description>
              <Description term="更新者">{current.updUserCode}</Description>
              <Description term="更新备注">{current.updMark}</Description>
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
