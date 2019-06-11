import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button, Drawer, Spin } from 'antd';
import DictLabel from '@/components/Dict/DictLabel';

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
    const { visible, current, loading } = this.props;

    return (
      <div>
        <Drawer title="详情" width={550} placement="right" onClose={this.cancel} visible={visible}>
          <Spin spinning={loading}>
            <DescriptionList col="1" size="large" style={{ marginBottom: 32, paddingBottom: 20 }}>
              <Description term="编号">{current.code}</Description>
              <Description term="名称">{current.name}</Description>
              <Description term="路径">{current.path}</Description>
              <Description term="请求方法">
                {
                  <DictLabel
                    source={[
                      { value: 'GET', label: 'GET' },
                      { value: 'POST', label: 'POST' },
                      { value: 'PUT', label: 'PUT' },
                      { value: 'DELETE', label: 'DELETE' },
                    ]}
                    value={current.requestMethod}
                  />
                }
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
