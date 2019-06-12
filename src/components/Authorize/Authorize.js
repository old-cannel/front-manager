import { connect } from 'dva';
import React, { PureComponent } from 'react';

@connect(({ user }) => ({
  operationCodes: user.operationCodes,
  currentUser: user.currentUser,
}))
class Authorize extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, code, currentUser = {}, operationCodes = [] } = this.props;
    const checkAuthorize = () => {
      // 如果是超级管理员 显示功能
      if (currentUser && currentUser.adminFlag === '1') {
        return true;
      }
      return operationCodes.filter(item => item === code).length !== 0;
    };
    return <span>{children && checkAuthorize() ? <span>{children}</span> : null}</span>;
  }
}

export default Authorize;
