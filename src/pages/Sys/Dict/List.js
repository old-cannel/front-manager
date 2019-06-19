import React, { Component } from 'react';
import { connect } from 'dva';
import { Button,Divider,Popconfirm,Table,message, } from 'antd';
import Filter from './Filter';
import TextClamp from '@/components/TextClamp/index';
import Add from './Add';
import Edit from './Edit';
import Authorize from '@/components/Authorize/Authorize'

@connect(({ loading,sysdict }) => ({
  pagination: sysdict.pagination,
  list: sysdict.list,
  current: sysdict.current,
  loading: loading.effects['sysdict/queryList'],
  filterKey: sysdict.filterKey,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editVisible: false,
      addVisible: false,
      type:'',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysdict/queryList' });
  }

  // 新增
  add = () => {
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysdict/updateState' });
    dispatch({ type: 'sysdict/edit', payload: { id: record.id } });
  };

  addKeyValue= record => {
    this.setState({ addVisible: true ,type:record.type});
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysdict/delete', payload: { id } });
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
    dispatch({ type: 'sysdict/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysdict/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysdict/updateState', payload: { current: {}, filterKey: Math.random() } });
        dispatch({ type: 'sysdict/queryList' });
        dispatch({ type: 'sysdict/getAllDict' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysdict/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false,type:'' });
        dispatch({ type: 'sysdict/updateState', payload: {  filterKey: Math.random() } });
        dispatch({ type: 'sysdict/queryList' });
        dispatch({ type: 'sysdict/getAllDict' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };



  render() {
    const {
      list, loading, pagination, dispatch, current,filterKey,
    } = this.props;
    const { editVisible, addVisible,type } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
          title: '字典类型',
          dataIndex:'type',
          key: 'type',
        },{
          title: '字典标签',
          dataIndex:'dictKey',
          key: 'dictKey',
        },{
          title: '字典值',
          dataIndex:'dictValue',
          key: 'dictValue',
          render: text => <TextClamp>{text}</TextClamp>,
        },{
          title: '排序',
          dataIndex:'sort',
          key: 'sort',
        },{
          title: '备注',
          dataIndex:'remark',
          key: 'remark',
          render: text => <TextClamp>{text}</TextClamp>,
        },{
          title: '操作',
          render:(text,record)=>{
            const operation =
              <span>
                <Authorize code="SYS_DICT_UPDATE">
                  <a href="javascript:void(0)" onClick={()=>{this.edit(record)}}>修改</a> <Divider type="vertical" />
                </Authorize>
                <Authorize code="SYS_DICT_DELETE">
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
                <Authorize code="SYS_DICT_ADD">
                  <a href="javascript:void(0)" onClick={()=>{this.addKeyValue(record)}}>添加键值</a>
                </Authorize>
              </span>
            return  operation
          }
        },]

    return (
      <div>
        <Filter key={filterKey} ref={this.filterRef} />
        <Authorize code="SYS_DICT_ADD">
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
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysdict/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        }

        {
          addVisible && <Add
            type={type}
            visible={addVisible}
            onCancel={() => {
              this.setState({ addVisible: false ,type:''});
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
