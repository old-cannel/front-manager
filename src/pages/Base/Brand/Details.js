import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button, Drawer, Spin } from 'antd';
import Api from '@/services/api';

const { Description } = DescriptionList;
const { IMG_PATH } = Api.upload;
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
    const { visible, current, loading } = this.props;

    return (
      <div>
        <Drawer title="详情" width={550} placement="right" onClose={this.cancel} visible={visible}>
          <Spin spinning={loading}>
            <DescriptionList col="1" size="large" style={{ marginBottom: 32, paddingBottom: 20 }}>
              <Description term="品牌名称">{current.brandName}</Description>
              <Description term="排序">{current.sort}</Description>
              <Description term="品牌商标">
                <img src={`${IMG_PATH}${current.brandUrl}`} alt="品牌商标" />
              </Description>
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
