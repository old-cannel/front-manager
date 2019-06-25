import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Divider, Popconfirm, Table, message } from 'antd';
import DictLabel from '@/components/Dict/DictLabel';
import TextClamp from '@/components/TextClamp/index';
import Add from './Add';
import Edit from './Edit';
import Details from './Details';
import Authorize from '@/components/Authorize/Authorize'

@connect(({ loading, sysapi }) => ({
  list: sysapi.list,
  current: sysapi.current,
  detailsLoading: loading.effects['sysapi/get'],
  loading: loading.effects['sysapi/queryList'],
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
    dispatch({ type: 'sysapi/queryList' });
  }

  // 新增
  add = () => {
    this.setState({ addVisible: true });
  };

  // 编辑
  edit = record => {
    this.setState({ editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysapi/updateState' });
    dispatch({ type: 'sysapi/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysapi/delete', payload: { id } });
  };

  // 详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: 'sysapi/get', payload: { id: record.id } });
  };

  // list change
  tableChange = page => {
    const { dispatch } = this.props;
    const payload = {
      size: page.pageSize,
      current: page.current,
    };
    dispatch({ type: 'sysapi/queryList', payload });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysapi/update', payload: values }).then(result => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        dispatch({ type: 'sysapi/updateState', payload: { current: {} } });
        dispatch({ type: 'sysapi/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysapi/save', payload: values }).then(result => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ addVisible: false });
        dispatch({ type: 'sysapi/queryList' });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  checkName=(rule, value, callback,id)=>{
    if(value){
      const { dispatch} = this.props;
      dispatch({
        type: 'sysapi/checkName',
        payload: { name:value, id },
      }).then(({ result }) => {
        if (result > 0) {
          callback('api名称已经存在');
        } else {
          callback();
        }
      });
    }else{
      callback();
    }
  }

  checkUrl=(rule, value, callback,id,requestMethod)=>{
    if(value && requestMethod){
      const { dispatch} = this.props;
      dispatch({
        type: 'sysapi/checkUrl',
        payload: { path:value, id,requestMethod },
      }).then(({ result }) => {
        if (result > 0) {
          callback('url已经存在');
        } else {
          callback();
        }
      });
    }else{
      callback();
    }
  }

  checkMethod=(rule, value, callback,id,url)=>{
    if(value && url){
      const { dispatch} = this.props;
      dispatch({
        type: 'sysapi/checkUrl',
        payload: { path:url, id,requestMethod:value },
      }).then(({ result }) => {
        if (result > 0) {
          callback('请求方法已存在');
        } else {
          callback();
        }
      });
    }else{
      callback();
    }
  }




  render() {
    const { list, loading, dispatch, current, detailsLoading } = this.props;
    const { editVisible, detailVisible, addVisible } = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: text => {
          return <TextClamp>{text}</TextClamp>;
        },
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
        render: text => {
          return <TextClamp>{text}</TextClamp>;
        },
      },
      {
        title: '请求方法',
        dataIndex: 'requestMethod',
        key: 'requestMethod',
        render: text => {
          return (
            <DictLabel
              source={[
                { value: 'GET', label: 'GET' },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
                { value: 'DELETE', label: 'DELETE' },
              ]}
              value={text}
            />
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          const operation = (
            <span>
              <a
                style={{display:'none'}}
                href="javascript:void(0)"
                onClick={() => {
                  this.details(record);
                }}
              >
                详情
              </a>
              <Authorize code="SYS_API_UPDATE">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.edit(record);
                  }}
                >
                  修改
                </a>
                <Divider type="vertical" />
              </Authorize>

              <Authorize code="SYS_API_DELETE">
                <Popconfirm
                  title="您确认删除吗？"
                  onConfirm={() => {
                      this.confirmDel(record.id);
                    }}
                  okText="确认"
                  cancelText="取消">
                  <a href="javascript:void(0)">删除</a>
                </Popconfirm>
              </Authorize>
            </span>
          );
          return operation;
        },
      },
    ];

    return (
      <div>
        <Authorize code="SYS_API_ADD">
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
          pagination={{ hideOnSinglePage: true, pageSize: 99999999 }}
        />
        {editVisible && (
          <Edit
            checkName={this.checkName}
            checkMethod={this.checkMethod}
            checkUrl={this.checkUrl}
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysapi/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.update(values, callback);
            }}
          />
        )}

        {addVisible && (
          <Add
            checkName={this.checkName}
            checkMethod={this.checkMethod}
            checkUrl={this.checkUrl}
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
            dispatch({ type: 'sysapi/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
