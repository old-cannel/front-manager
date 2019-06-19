import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';
import DictLabel from '@/components/Dict/DictLabel';
import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';
import Details from './Details';
import TextClamp from '@/components/TextClamp/index';
import Authorize from '@/components/Authorize/Authorize'

@connect(({ loading,sysorganization }) => ({
  pagination: sysorganization.pagination,
  list: sysorganization.list,
  current: sysorganization.current,
  detailsLoading: loading.effects['sysorganization/get'],
  loading: loading.effects['sysorganization/queryList'],
  filterKey: sysorganization.filterKey,
  allList: sysorganization.allList,
  optionsArea:sysorganization.optionsArea,
  managerUsers:sysorganization.managerUsers,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editVisible: false,
      addVisible: false,
      code:'',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/queryList' });
  }

  // 新增
  add = () => {
    const {dispatch}=this.props
    dispatch({type:'sysorganization/editInit'})
    dispatch({ type: 'sysorganization/updateState', payload: { current: {} } });
    this.setState({ addVisible: true,code:'' });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/updateState' });
    dispatch({type:'sysorganization/editInit'})
    dispatch({ type: 'sysorganization/edit', payload: { id: record.id } });
  };

  addNext = record => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/editInit' });
    dispatch({ type: 'sysorganization/updateState', payload: { current: {} } });
    this.setState({ addVisible: true, code: record.code, });
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/delete', payload: { id } });
  };


  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'sysorganization/get', payload: { id: record.id } });
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
    dispatch({ type: 'sysorganization/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysorganization/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysorganization/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysorganization/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false ,code:''});
        dispatch({ type: 'sysorganization/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysorganization/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };




  render() {
    const {
      list, loading, pagination, dispatch, current,
      detailsLoading,filterKey,allList,optionsArea,managerUsers
    } = this.props;
    const { editVisible, detailVisible, addVisible,code } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '机构名称',
          dataIndex:'name',
          key: 'name',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '机构编码',
          dataIndex:'code',
          key: 'code',
        },{
          title: '机构类型',
          dataIndex:'orgType',
          key: 'orgType',
          render:text=>{
            return <DictLabel type="org_type" value={text} />
          }
        },{
          title: '负责人',
          dataIndex:'fullName',
          key: 'fullName',
        },{
          title: '手机号',
          dataIndex:'mobileNum',
          key: 'mobileNum',
        },{
          title: '归属区域',
          dataIndex:'addressName',
          key: 'addressName',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '详细地址',
          dataIndex:'address',
          key: 'address',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <Authorize code="SYS_ORGANIZATION_UPDATE">
                  <a href="javascript:void(0)" onClick={()=>{this.edit(record)}}>修改</a> <Divider
                    type="vertical"
                  />
                </Authorize>
                <Authorize code="SYS_ORGANIZATION_DELETE">
                  <Popconfirm
                    title="您确认删除吗？"
                    onConfirm={()=>{this.confirmDel(record.id)}}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0)">删除</a>
                    <Divider type="vertical" />
                  </Popconfirm>
                </Authorize>
                <Authorize code="SYS_ORGANIZATION_ADD">
                  <a href="javascript:void(0)" onClick={()=>{this.addNext(record)}}>添加下级机构</a>
                </Authorize>
              </span>
            return  operation
          }
        },]
    
    return (
      <div>
        <Filter key={filterKey} ref={this.filterRef} />
        <Authorize code="SYS_ORGANIZATION_ADD">
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
            managerUsers={managerUsers}
            allList={allList}
            optionsArea={optionsArea}
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysorganization/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        }

        {
          addVisible && <Add
            managerUsers={managerUsers}
            code={code}
            optionsArea={optionsArea}
            visible={addVisible}
            allList={allList}
            onCancel={() => {
              this.setState({ addVisible: false,code:'' });
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
            dispatch({ type: 'sysorganization/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;