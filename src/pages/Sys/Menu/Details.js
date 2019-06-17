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
              <Description term="菜单名称">{current.name}</Description>
              <Description term="URL">{current.url}</Description>
              <Description term="排序">{current.sort}</Description>
              <Description term="显示标识0否，1是">{current.showFlag}</Description>
              <Description term="备注">{current.remark}</Description>
              <Description term="上级编码">{current.supCode}</Description>
              <Description term="上级名称">{current.supName}</Description>
              <Description term="上级编码集合">{current.supCodes}</Description>
              <Description term="上级名称集合">{current.supNames}</Description>
              <Description term="深度,默认是1">{current.deep}</Description>
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
