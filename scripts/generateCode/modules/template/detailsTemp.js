import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
#{IMPORTANTD}
#{IMPORTDYNAMIC}
const { Description } = DescriptionList;


class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  //返回关闭
  cancel = () => {
    const {onCancel } = this.props;
    if(onCancel){
      onCancel()
    }
  };


  render() {
    const {
      detailVisible,
      current,
      loading
    } = this.props;


    return (
      <div>
        <Drawer
          title={"详情"}
          width={#{DRAWERWIDTH}}
          placement="right"
          onClose={this.cancel}
          visible={detailVisible}
        >
          <Spin spinning={loading}>
              #{DETAILSITEM}
            <div style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}>
              <Button onClick={this.cancel} style={{ marginRight: 8 }}>
                返回
              </Button>
            </div>
          </Spin>
        </Drawer>
      </div>
    );
  }
}

export default Detail;
