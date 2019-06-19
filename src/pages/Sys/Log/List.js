import React, { Component } from 'react';
import { connect } from 'dva';
import {Divider,Table,message, } from 'antd';


import Filter from './Filter';
import Details from './Details';

@connect(({ loading,syslog }) => ({
  pagination: syslog.pagination,
  list: syslog.list,
  current: syslog.current,
  detailsLoading: loading.effects['syslog/get'],
  loading: loading.effects['syslog/queryList'],
  filterKey: syslog.filterKey,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {

    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'syslog/queryList' });
  }




  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'syslog/delete', payload: { id } });
  };


  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'syslog/get', payload: { id: record.id } });
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
    dispatch({ type: 'syslog/queryList', payload });
  };




  render() {
    const {
      list, loading, pagination, dispatch, current,
      detailsLoading,filterKey,
    } = this.props;
    const {  detailVisible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '操作时间',
          dataIndex:'addTime',
          key: 'addTime',
        },{
          title: '操作人',
          dataIndex:'operationPerson',
          key: 'operationPerson',
        },{
          title: 'API名称',
          dataIndex:'name',
          key: 'name',
        },{
          title: '路径',
          dataIndex:'path',
          key: 'path',
        },{
          title: '方法名',
          dataIndex:'requestMethod',
          key: 'requestMethod',
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <a href="javascript:void(0)" onClick={()=>{this.details(record)}}>详情</a> <Divider type="vertical" />
              </span>
            return  operation
          }
        },]
    
    return (
      <div>
        <Filter key={filterKey} ref={this.filterRef} />

        <Table
          key={JSON.stringify(loading)}
          
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={paginationProps}
        />


        <Details
          loading={detailsLoading}
          visible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: 'syslog/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
