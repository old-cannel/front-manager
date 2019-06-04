import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Divider, Popconfirm, Table, message } from 'antd';
import Api from '@/services/api';
import Filter from './Filter';
import Add from './Add';
import Edit from './Edit';
import Details from './Details';

const { IMG_PATH } = Api.upload;
@connect(({ loading, basicdatabrand }) => ({
  pagination: basicdatabrand.pagination,
  list: basicdatabrand.list,
  current: basicdatabrand.current,
  detailsLoading: loading.effects['basicdatabrand/get'],
  loading: loading.effects['basicdatabrand/queryList'],
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
    dispatch({ type: 'basicdatabrand/queryList' });
  }

  // 新增
  add = () => {
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'basicdatabrand/updateState' });
    dispatch({ type: 'basicdatabrand/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'basicdatabrand/delete', payload: { id } });
  };

  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'basicdatabrand/get', payload: { id: record.id } });
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
    dispatch({ type: 'basicdatabrand/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'basicdatabrand/update', payload: values }).then(result => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'basicdatabrand/updateState', payload: { current: {} } });
        dispatch({ type: 'basicdatabrand/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'basicdatabrand/save', payload: values }).then(result => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false });
        dispatch({ type: 'basicdatabrand/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  render() {
    const { list, loading, pagination, dispatch, current, detailsLoading } = this.props;
    const { editVisible, detailVisible, addVisible } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const columns = [
      {
        title: '品牌名称',
        dataIndex: 'brandName',
        key: 'brandName',
      },
      {
        title: '品牌商标',
        dataIndex: 'brandUrl',
        key: 'brandUrl',
        render: text => {
          return IMG_PATH + text;
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '操作',
        render: (text, record) => {
          const operation = (
            <span>
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.details(record);
                }}
              >
                详情
              </a>{' '}
              <Divider type="vertical" />
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.edit(record);
                }}
              >
                修改
              </a>{' '}
              <Divider type="vertical" />
              <Popconfirm
                title="您确认删除吗？"
                onConfirm={() => {
                  this.confirmDel(record.id);
                }}
                okText="确认"
                cancelText="取消"
              >
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </span>
          );
          return operation;
        },
      },
    ];

    return (
      <div>
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
          key={JSON.stringify(loading)}
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={list}
          pagination={paginationProps}
        />
        {editVisible && (
          <Edit
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'basicdatabrand/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        )}

        {addVisible && (
          <Add
            visible={addVisible}
            onCancel={() => {
              this.setState({ addVisible: false });
            }}
            onOk={(values, callback) => {
              this.save(values, callback);
            }}
          />
        )}

        <Details
          loading={detailsLoading}
          visible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: 'basicdatabrand/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
