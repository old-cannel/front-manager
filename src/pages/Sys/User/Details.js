import React, { Component } from 'react';
import DescriptionList from '@/components/DescriptionList';
import { Button, Drawer, Spin } from 'antd';
import { FILE_DISPLAY_PREFIX } from '../../../services/api';

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
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };


  render() {
    const {
      visible,
      current,
      loading,
    } = this.props;


    return (
      <div>
        <Drawer
          title="详情"
          width={900}
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <DescriptionList col="2" size="large" style={{ marginBottom: 32, paddingBottom: 20 }}>
              <Description term="编码">{current.userCode}</Description>
              <Description term="工号">{current.workNum}</Description>
              <Description term="员工头像"><img alt="员工头像" style={{width:100,height:100,objectFit: "cover"}} src={FILE_DISPLAY_PREFIX+current.userHeader} /></Description>
              <Description term="用户名">{current.userName}</Description>
              <Description term="姓名">{current.fullName}</Description>
              <Description term="身份证号">{current.idNum}</Description>
              <Description term="手机号">{current.mobileNum}</Description>
              <Description term="邮箱">{current.email}</Description>
              <Description term="所属机构">{current.srcOrgName}</Description>
              <Description term="岗位">{current.position}</Description>
              <Description term="入职时间">{current.entryTime}</Description>
              <Description term="状态">{current.enabled ? '正常' : '冻结'}</Description>
            </DescriptionList>
            <DescriptionList col="1" size="large">
              <Description term="超级管理员">{current.adminFlag === '1' ? '是' : '否'}</Description>
            </DescriptionList>
            <DescriptionList col="1" size="large">
              <Description term="用户角色">{current.rolesName}</Description>
            </DescriptionList>
            <DescriptionList col="1" size="large">
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
