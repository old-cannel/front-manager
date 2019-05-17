import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';

import Filter from './Filter';
import Edit from './Edit';
import Details from './Details';

@connect(({ loading,systest }) => ({
  pagination: systest.pagination,
  list: systest.list,
  current: systest.current,
  detailsLoading:loading.effects['systest/get'],
  loading: loading.effects['systest/queryList'],
  editLoading:systest.editLoading,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editTitle: '',
      editVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'systest/queryList' });
  }

  // 新增
  add = () => {
    this.setState({ editTitle: '新增', editVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editTitle: '修改', editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'systest/updateState', payload: { editLoading: true } });
    dispatch({ type: 'systest/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel=(id)=>{
    const { dispatch } = this.props;
    dispatch({type:'systest/delete',payload:{id}})
  }


  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'systest/get', payload: { id: record.id } });
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
    dispatch({ type: 'systest/queryList', payload });
  };

  // 保存
  saveForm = (values, resetFields) => {
    const { dispatch } = this.props;
    dispatch({type:'systest/updateState',payload:{editLoading:true}})
    const url = values.id ? 'systest/update' : 'systest/save';
    dispatch({ type: url, payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editTitle: '', editVisible: false });
        dispatch({type:'systest/updateState',payload:{current:{},editLoading:false}})
        dispatch({ type: 'systest/queryList' });
        resetFields();
      } else {
        dispatch({type:'systest/updateState',payload:{editLoading:false}})
        message.error(result.msg);
      }
    });
  };



  render() {
    const {
      list, loading, pagination, dispatch, current,
      detailsLoading, editLoading,
    } = this.props;
    const { editTitle, editVisible, detailVisible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '编码',
          dataIndex:'code',
          key: 'code',
        },{
          title: '用户名',
          dataIndex:'name',
          key: 'name',
        },{
          title: '创建时间',
          dataIndex:'addTime',
          key: 'addTime',
        },{
          title: '修改时间',
          dataIndex:'updTime',
          key: 'updTime',
        },{
          title: '创建者',
          dataIndex:'addUserCode',
          key: 'addUserCode',
        },{
          title: '新增备注',
          dataIndex:'addMark',
          key: 'addMark',
        },{
          title: '更新者',
          dataIndex:'updUserCode',
          key: 'updUserCode',
        },{
          title: '更新备注',
          dataIndex:'updMark',
          key: 'updMark',
        },{
          title: '操作',
          render:(text,record)=>{
              return <span>
                <a href="javascript:void(0)" onClick={()=>{this.details(record)}}>详情</a> <Divider type="vertical" />
                <a href="javascript:void(0)" onClick={()=>{this.edit(record)}}>修改</a> <Divider 
                  type="vertical"
                />
                <Popconfirm
                  title="您确认删除吗？"
                  onConfirm={()=>{this.confirmDel(record.id)}}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="javascript:void(0)">删除</a>
                </Popconfirm>
                 
              </span>
          }
        },]


    return (
      <div className="container">
        <Filter ref={this.filterRef} />
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
        <Table
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={paginationProps}
        />
        <Edit
          editTitle={editTitle}
          dispatch={dispatch}
          editVisible={editVisible}
          loading={editLoading}
          current={current}
          onCancel={() => {
            dispatch({ type: 'systest/updateState', payload: { current: {} } });
            this.setState({ editVisible: false });
          }}
          onOk={(values, resetFields) => {
            this.saveForm(values, resetFields);
          }}
        />
        <Details
          loading={detailsLoading}
          detailVisible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: 'systest/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
