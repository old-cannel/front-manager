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
          width={550}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="1" size="large" style={{ marginBottom: 32,paddingBottom:20 }}>
              <Description term="区域名称">{current.name}</Description>
              <Description term="区域类型">{<DictLabel type="area_type" value={current.type} />}</Description>
              <Description term="备注">{current.remark}</Description>
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
