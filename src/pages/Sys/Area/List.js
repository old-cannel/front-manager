import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';
import DictLabel from '@/components/Dict/DictLabel';
import TextClamp from '@/components/TextClamp/index';
import Authorize from '@/components/Authorize/Authorize'


import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';


@connect(({ loading,sysarea }) => ({
  list: sysarea.list,
  current: sysarea.current,
  loading: loading.effects['sysarea/queryList'],
  filterKey: sysarea.filterKey,
  editLoading: sysarea.editLoading ,
  allList: sysarea.allList ,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editVisible: false,
      addVisible: false,
      supId:'',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysarea/queryList' });
  }

  // 新增
  add = () => {
    const {dispatch}=this.props
    dispatch({type:"sysarea/listTree"})
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({type:"sysarea/listTree"})
    dispatch({ type: 'sysarea/updateState' });
    dispatch({ type: 'sysarea/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysarea/delete', payload: { id } });
  };




  // 下级区域
  addNext = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysarea/listTree' });
    this.setState({ addVisible: true, supId: record.id });
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
    dispatch({ type: 'sysarea/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysarea/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysarea/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysarea/queryList' });
      } else {
        callback();
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysarea/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false,supId: "" });
        dispatch({ type: 'sysarea/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysarea/queryList' });
      } else {
        callback();
      }
    });
  };

  expandedRowKeys=()=>{
    const {list } = this.props;
    let ids=[];
    list.forEach(item=>{
      if(item.type==="0" || item.type==="1"){
        ids.push(item.id)
      }
    })
    return ids
  }



  render() {
    const {
      list, loading, dispatch, current,filterKey,editLoading,allList,
    } = this.props;
    const { editVisible, addVisible,supId } = this.state;


    const columns = [{
          title: '区域名称',
          dataIndex:'name',
          key: 'name',
        },{
          title: '区域编码',
          dataIndex:'code',
          key: 'code',
        },{
          title: '区域类型',
          dataIndex:'type',
          key: 'type',
          render:text=>{
            return <DictLabel type="area_type" value={text} />
          }
        },{
          title: '备注',
          dataIndex:'remark',
          key: 'remark',
          render:text=><TextClamp>{text}</TextClamp>
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <Authorize code="SYS_AREA_UPDATE">
                  <a href="javascript:void(0)" onClick={()=>{this.edit(record)}}>修改</a> <Divider
                    type="vertical"
                  />
                </Authorize>
                <Authorize code="SYS_AREA_DELETE">
                  <Popconfirm
                    title="您确认删除吗？"
                    onConfirm={()=>{this.confirmDel(record.id)}}
                    okText="确认"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0)">删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </Authorize>
                <Authorize code="SYS_AREA_ADD">
                  <a href="javascript:void(0)" onClick={()=>{this.addNext(record)}}>添加下级区域</a>
                </Authorize>
              </span>
            return  operation
          }
        },]
    
    return (
      <div>
        <Filter key={filterKey} ref={this.filterRef} />
        <div className="tableTopBut">
          <Authorize code="SYS_AREA_ADD">
            <Button
              onClick={() => {
                this.add();
              }}
              type="primary"
            >
              新增
            </Button>
          </Authorize>
          
        </div>
        <Table
          defaultExpandedRowKeys={this.expandedRowKeys()}
          key={JSON.stringify(loading)}
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={{ hideOnSinglePage: true, pageSize: 99999999 }}
        />
        {
          editVisible &&  <Edit
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysarea/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        }

        {
          addVisible && <Add
            supId={supId}
            allList={allList}
            editLoading={editLoading}
            visible={addVisible}
            onCancel={() => {
              this.setState({ addVisible: false, supId: "" });
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
