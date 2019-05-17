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
          <Spin  spinning={loading}>
              #{DETAILSITEM}
          </Spin>
          <div  className="drawerFooter">
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
