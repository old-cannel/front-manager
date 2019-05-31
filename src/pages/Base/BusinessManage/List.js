import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Divider, Popconfirm, Table, message,} from 'antd';


import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';
import Details from './Details';

@connect(({loading, basebusinessManage}) => ({
  pagination: basebusinessManage.pagination,
  list: basebusinessManage.list,
  current: basebusinessManage.current,
  detailsLoading: loading.effects['basebusinessManage/get'],
  loading: loading.effects['basebusinessManage/queryList'],
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
    const {dispatch} = this.props;
    dispatch({type: 'basebusinessManage/queryList'});
  }

  // 新增
  add = () => {
    this.setState({addVisible: true});
  };

  // 编辑
  edit = record => {
    this.setState({editVisible: true});
    const {dispatch} = this.props;
    dispatch({type: 'basebusinessManage/updateState'});
    dispatch({type: 'basebusinessManage/edit', payload: {id: record.id}});
  };

  // 删除
  confirmDel = (id) => {
    const {dispatch} = this.props;
    dispatch({type: 'basebusinessManage/delete', payload: {id}});
  };


  // 详情
  details = record => {
    const {dispatch} = this.props;
    this.setState({detailVisible: true});
    dispatch({type: 'basebusinessManage/get', payload: {id: record.id}});
  };

  // list change
  tableChange = page => {
    const searchParam = this.filterRef.current.getFieldsValue();
    const {dispatch} = this.props;
    const payload = {
      size: page.pageSize,
      current: page.current,
      ...searchParam,
    };
    dispatch({type: 'basebusinessManage/queryList', payload});
  };

  // 修改
  update = (values, callback) => {
    const {dispatch} = this.props;
    dispatch({type: 'basebusinessManage/update', payload: values}).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({editVisible: false});
        dispatch({type: 'basebusinessManage/updateState', payload: {current: {}}});
        dispatch({type: 'basebusinessManage/queryList'});
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const {dispatch} = this.props;
    dispatch({type: 'basebusinessManage/save', payload: values}).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({addVisible: false});
        dispatch({type: 'basebusinessManage/queryList'});
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  handleText = text => {
    let textview = text;
    if (textview === undefined || textview === '') {
      textview = '';
    } else if (textview.length > 10) {
      textview = `${textview.substring(0, 10)}...`;
    }
    return <div title={text}>{textview}</div>;
  };

  render() {
    const {
      list, loading, pagination, dispatch, current,
      detailsLoading,
    } = this.props;
    const {editVisible, detailVisible, addVisible} = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [{
      title: '商家名称',
      dataIndex: 'businessName',
      key: 'businessName',
      render: text => this.handleText(text),
    }, {
      title: '联系人',
      dataIndex: 'contacts',
      key: 'contacts',
      render: text => this.handleText(text),
    }, {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '商家地址',
      dataIndex: 'address',
      key: 'address',
      render: text => this.handleText(text),
    }, {
      title: '法人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
      render: text => this.handleText(text),
    }, {
      title: '入住方式',
      dataIndex: 'source',
      key: 'source',
    }, {
      title: '入住时间',
      dataIndex: 'checkinTime',
      key: 'checkinTime',
    }, {
      title: '操作',
      render: (text, record) => (
          <span>
            <a href="javascript:void(0)" onClick={() => { this.edit(record) }}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="您确认删除吗？"
              onConfirm={() => { this.confirmDel(record.id) }}
              okText="确认"
              cancelText="取消" >
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>
            <Divider type="vertical"/>
            <a href="javascript:void(0)" onClick={() => { this.edit(record.id) }}>重置密码</a>
          </span>)
    },];

    return (
      <div>
        <Filter ref={this.filterRef}/>
        <div style={{marginTop: 10}}>
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
          key={JSON.stringify(loading)}

          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={paginationProps}
        />
        {
          editVisible && <Edit
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({type: 'basebusinessManage/updateState', payload: {current: {}}});
              this.setState({editVisible: false});
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
              this.setState({addVisible: false});
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
            dispatch({type: 'basebusinessManage/updateState', payload: {current: {}}});
            this.setState({detailVisible: false});
          }}
        />
      </div>
    );
  }
}

export default List;
