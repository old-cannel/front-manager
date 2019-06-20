import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';
import Authorize from '@/components/Authorize/Authorize'
import Add from './Add';
import Edit from './Edit';

@connect(({ loading,sysrole }) => ({
  pagination: sysrole.pagination,
  list: sysrole.list,
  current: sysrole.current,
  loading: loading.effects['sysrole/queryList'],
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      addVisible: false,
      editId:""
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysrole/queryList' });
  }

  // 新增
  add = () => {
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true,editId:record.id });
    const { dispatch } = this.props;
    dispatch({ type: 'sysrole/updateState' });
    dispatch({ type: 'sysrole/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysrole/delete', payload: { id } });
  };




  // list change
  tableChange = page => {
    const { dispatch } = this.props;
    const payload = {
      size: page.pageSize,
      current: page.current,
    };
    dispatch({ type: 'sysrole/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysrole/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysrole/updateState', payload: { current: {} } });
        dispatch({ type: 'sysrole/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysrole/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false });
        dispatch({ type: 'sysrole/updateState', payload: { current: {} } });
        dispatch({ type: 'sysrole/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };



  render() {
    const {
      list, loading, pagination, dispatch, current,
    } = this.props;
    const { editVisible, addVisible,editId } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '角色编码',
          dataIndex:'code',
          key: 'code',
        },{
          title: '角色名称',
          dataIndex:'name',
          key: 'name',
        },{
          title: '状态',
          dataIndex:'status',
          key: 'status',
        },{
          title: '创建人',
          dataIndex:'userName',
          key: 'userName',
        },{
          title: '新建时间',
          dataIndex:'addTime',
          key: 'addTime',
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <Authorize code="SYS_ROLE_UPDATE">
                  <a href="javascript:void(0)" onClick={()=>{this.edit(record)}}>修改</a> <Divider
                    type="vertical"
                  />
                </Authorize>
                <Authorize code="SYS_ROLE_DELETE">
                  <Popconfirm
                    title="您确认删除吗？"
                    onConfirm={()=>{this.confirmDel(record.id)}}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0)">删除</a>
                  </Popconfirm>
                </Authorize>
              </span>
            return  operation
          }
        },]
    
    return (
      <div>
        <Authorize code="SYS_ROLE_ADD">
          <div className="tableTopBut">
            <Button
              onClick={() => {
                this.add();
              }}
              type="primary"
            >
              新增
            </Button>

          </div>
        </Authorize>
        <Table
          key={JSON.stringify(loading)}
          
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={paginationProps}
        />
        {
          editVisible &&  <Edit
            roleId={editId}
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysrole/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        }

        {
          addVisible && <Add
            visible={addVisible}
            onCancel={() => {
              this.setState({ addVisible: false });
            }}
            onOk={(values, callback) => {
              this.save(values, callback);
            }}
          />
        }
      </div>
    );
  }
}

export default List;
