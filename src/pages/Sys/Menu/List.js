import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Divider, Popconfirm, Table, message } from 'antd';
import TextClamp from '@/components/TextClamp/index';
import Edit from './Edit';
import Details from './Details';
import Authorize from '@/components/Authorize/Authorize'
import DictLabel from '@/components/Dict/DictLabel';

@connect(({ loading, sysmenu }) => ({
  current: sysmenu.current,
  detailsLoading: loading.effects['sysmenu/get'],
  loading: loading.effects['sysmenu/queryList'],
  filterKey: sysmenu.filterKey,
  menuTreeData: sysmenu.menuTreeData,
}))

class List extends Component {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      editVisible: false,
      editTitle: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/queryList' });
  }


  // 编辑
  edit = record => {
    this.setState({ editTitle: '2', editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/edit', payload: { id: record.id } });
  };

  // 删除
  confirmDel = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/delete', payload: { id } });
  };


  // 添加下级
  addNext = record => {
    this.setState({ editTitle: '1', editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/updateState', payload: { current:{supId:record.id} } });
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
    dispatch({ type: 'sysmenu/queryList', payload });
  };

  // 新增
  add = () => {
    this.setState({ editTitle: '1', editVisible: true });
  };

  // 修改
  update = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/update', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editVisible: false });
        this.setState({editVisible:false})
        dispatch({ type: 'sysmenu/updateState'});
        dispatch({ type: 'sysmenu/queryList' });
        dispatch({ type: 'sysmenu/updateState', payload: { current: {} } });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  // 新增
  save = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sysmenu/save', payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({editVisible:false})
        dispatch({ type: 'sysmenu/queryList' });
        dispatch({ type: 'sysmenu/updateState', payload: { current: {} } });
      } else {
        callback();
        message.error(result.msg);
      }
    });
  };

  saveData = (values, callback) => {
    if (values.id) {
      this.update(values, callback);
    }else{
      this.save(values, callback);
    }
  };

  expandedRowKeys=()=>{
    const {menuTreeData } = this.props;
    let ids=[];
    menuTreeData.forEach(item=>{
      if(item.children){
        ids.push(item.id)
      }
    })
    return ids
  }

  render() {
    const {
      loading, dispatch, current, menuTreeData,
      detailsLoading,
    } = this.props;
    const { editVisible, detailVisible, editTitle } = this.state;
    const columns = [{
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '菜单编码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    }, {
      title: '可见',
      dataIndex: 'showFlag',
      key: 'showFlag',
      render:text=><DictLabel source={[  { value: '1', label: '显示' },  { value: '0', label: '隐藏' } ]} value={text} />
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render:text=><TextClamp>{text}</TextClamp>
    }, {
      title: '操作',
      render: (text, record) => {
        const operation =
          <span>
            <Authorize code="SYS_MENU_EDIT">
              {
                record.id!=="-1" && <span><a href="javascript:void(0)" onClick={() => { this.edit(record); }}>修改</a> <Divider type="vertical" /></span>
              }
            </Authorize>
            <Authorize code="SYS_MENU_DELETE">
              {
                record.id!=="-1" &&
                <span>
                  <Popconfirm
                    title="您确认删除吗？"
                    onConfirm={() => {
                      this.confirmDel(record.id);
                    }}
                    okText="确认"
                    placement="left"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0)">删除</a>
                  </Popconfirm><Divider type="vertical" />
                </span>
              }
            </Authorize>

            {
              <Authorize code="SYS_MENU_EDIT"><a href="javascript:void(0)" onClick={() => { this.addNext(record); }}>添加下级</a></Authorize>
            }
          </span>;
        return operation;
      },
    }];

    return (
      <div>
        <Authorize code="SYS_MENU_EDIT">
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
          defaultExpandedRowKeys={this.expandedRowKeys()}
          onChange={this.tableChange}
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={menuTreeData}
          pagination={{ hideOnSinglePage: true, pageSize: 99999999 }}
        />
        {
          editVisible && <Edit
            key={editVisible}
            menuTreeData={menuTreeData}
            title={editTitle}
            visible={editVisible}
            current={current}
            onCancel={() => {
              dispatch({ type: 'sysmenu/updateState', payload: { current: {} } });
              this.setState({ editVisible: false });
            }}
            onOk={(values, callback) => {
              this.saveData(values, callback);
            }}
          />
        }


        <Details
          loading={detailsLoading}
          visible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: 'sysmenu/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}
        />
      </div>
    );
  }
}

export default List;
