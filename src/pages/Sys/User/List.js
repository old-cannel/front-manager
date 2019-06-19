import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';
import TextClamp from '@/components/TextClamp/index';
import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';
import Details from './Details';
import Authorize from '@/components/Authorize/Authorize'

@connect(({ loading,sysuser }) => ({
  pagination: sysuser.pagination,
  list: sysuser.list,
  current: sysuser.current,
  detailsLoading: loading.effects['sysuser/get'],
  loading: loading.effects['sysuser/queryList'],
  filterKey: sysuser.filterKey,
  roleList: sysuser.roleList,
  orgList:sysuser.orgList,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editVisible: false,
      addVisible: false,
      
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysuser/queryList' });
  }

  // 新增
  add = () => {
    const {dispatch}=this.props
    dispatch({type:'sysuser/initEdit'})
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysuser/updateState' });
    dispatch({type:'sysuser/initEdit'})
    dispatch({ type: 'sysuser/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysuser/delete', payload: { id } });
  };


  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'sysuser/get', payload: { id: record.id } });
  };

  // list change
  tableChange = page => {
    const searchParam = this.filterRef.current.getFieldsValue();
    const { dispatch } = this.props;
    const payload = {
      size: page.pageSize,
      current: page.current,
      ...searchParam,
    };
    dispatch({ type: 'sysuser/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysuser/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysuser/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysuser/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysuser/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false });
        dispatch({ type: 'sysuser/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysuser/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  checkWorkNum = (rule, value, callback,id) => {
    if (value) {
      const { dispatch } = this.props;
      dispatch({
        type: 'sysuser/checkWorkNum',
        payload: { workNum: value, id: id || '' },
      }).then(({ result }) => {
        if (result > 0) {
          callback('工号已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };

  checkUserName = (rule, value, callback,id) => {
    if (value) {
      const { dispatch } = this.props;
      dispatch({
        type: 'sysuser/checkUserName',
        payload: { userName: value, id: id || '' },
      }).then(({ result }) => {
        if (result > 0) {
          callback('用户名已存在');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };




  render() {
    const {
      list, loading, pagination, dispatch, current,
      detailsLoading,filterKey,roleList,orgList,
    } = this.props;
    const { editVisible, detailVisible, addVisible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '编码',
          dataIndex:'userCode',
          key: 'userCode',
        },{
          title: '用户名',
          dataIndex:'userName',
          key: 'userName',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '姓名',
          dataIndex:'fullName',
          key: 'fullName',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '手机号',
          dataIndex:'mobileNum',
          key: 'mobileNum',
        },{
          title: '邮箱',
          dataIndex:'email',
          key: 'email',
        },{
          title: '工号',
          dataIndex:'workNum',
          key: 'workNum',
        },{
          title: '所属机构',
          dataIndex:'srcOrgName',
          key: 'srcOrgName',
        },{
          title: '状态',
          dataIndex:'enabled',
          key: 'enabled',
          render:(text)=>{
            return text?"正常":'冻结'
          }
        },{
          title: '入职时间',
          dataIndex:'entryTime',
          key: 'entryTime',
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <Authorize code="SYS_ROLE_DETAILS">
                  <a href="javascript:void(0)" onClick={()=>{this.details(record)}}>详情</a> <Divider type="vertical" />
                </Authorize>
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
        <Filter orgList={orgList} key={filterKey} ref={this.filterRef} />
        <Authorize code="SYS_ROLE_ADD">
          <div style={{ marginTop: 10 }}>
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
            checkWorkNum={this.checkWorkNum}
            checkUserName={this.checkUserName}
            orgList={orgList}
            roleList={roleList}
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysuser/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        }

        {
          addVisible && <Add
            checkWorkNum={this.checkWorkNum}
            checkUserName={this.checkUserName}
            orgList={orgList}
            roleList={roleList}
            visible={addVisible}
            onCancel={() => {
              this.setState({ addVisible: false });
            }}
            onOk={(values, callback) => {
              this.save(values, callback);
            }}
          />
        }

        <Details
          loading={detailsLoading}
          visible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: 'sysuser/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
