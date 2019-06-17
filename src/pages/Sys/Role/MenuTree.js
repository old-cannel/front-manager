import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';

const { TreeNode } = Tree;


@connect(({}) => ({}))
class MenuTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys :[],
      halfCheckedKeys:[],
      treeData:[],
    };
  }


  componentDidMount() {
    const { dispatch, onRef, roleId } = this.props;
    if (onRef) {
      onRef(this);
    }
    dispatch({ type: 'sysrole/getMenuAndOrganization' })
      .then(({ code, result }) => {
        if (code === 10000) {
          let baseMenu = { id: '-1', name: '平台菜单', url: '', code: '-1', supId: '-1', title: '平台菜单', value: '-1' };
          if (result && result.length > 0) {
            baseMenu.children = result;
          }
          this.setState({ treeData: [baseMenu] });
        }
      });
    if (roleId) {
      dispatch({ type: 'sysrole/getRoleMenus', payload: { id: roleId } })
        .then(({ code, result }) => {
          if (code === 10000) {
            this.setState({ checkedKeys: result.menuAndOperationIds, halfCheckedKeys: result.supMenuIds });
          }
        });
    }
  }


  onCheck = (checkedKeys , info) => {
    this.setState({ checkedKeys,halfCheckedKeys:info.halfCheckedKeys  });
  };


  renderDate=()=>{
    const { checkedKeys, halfCheckedKeys } = this.state;
    return [...checkedKeys, ...halfCheckedKeys].filter(item=>item!=="-1");
  }


  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} {...item} />;
    });


  render() {
    const { treeData,checkedKeys  } = this.state;
    return (
      <Tree
        checkable
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    );
  }
}

export default MenuTree;
