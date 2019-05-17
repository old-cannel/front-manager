import React, { Component } from 'react';
import { connect } from 'dva';
#{IMPORTANTD}
#{IMPORTDYNAMIC}
import Filter from './Filter';
import Edit from './Edit';
import Details from './Details';

@connect(({ loading,#{NAMESPACE} }) => ({
  pagination: #{NAMESPACE}.pagination,
  list: #{NAMESPACE}.list,
  current: #{NAMESPACE}.current,
  detailsLoading:loading.effects['#{NAMESPACE}/get'],
  loading: loading.effects['#{NAMESPACE}/queryList'],
  editLoading:#{NAMESPACE}.editLoading,
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
    dispatch({ type: '#{NAMESPACE}/queryList' });
  }

  //新增
  add = () => {
    this.setState({ editTitle: '新增', editVisible: true });
  };

  //编辑
  edit = record => {
    this.setState({ editTitle: '修改', editVisible: true });
    const { dispatch } = this.props;
    dispatch({ type: '#{NAMESPACE}/updateState', payload: { editLoading: true } });
    dispatch({ type: '#{NAMESPACE}/edit', payload: { id: record.id } });
  };

  //删除
  confirmDel=(id)=>{
    const { dispatch } = this.props;
    dispatch({type:'#{NAMESPACE}/delete',payload:{id}})
  }


  //详情
  details = record => {
    const { dispatch } = this.props;
    this.setState({ detailVisible: true });
    dispatch({ type: '#{NAMESPACE}/get', payload: { id: record.id } });
  };

  //list change
  tableChange = page => {
    const searchParam = this.filterRef.current.getFieldsValue();
    const { dispatch } = this.props;
    const payload = {
      size: page.pageSize,
      current: page.current,
      ...searchParam,
    };
    dispatch({ type: '#{NAMESPACE}/queryList', payload });
  };

  //保存
  saveForm = (values, resetFields) => {
    const { dispatch } = this.props;
    dispatch({type:'#{NAMESPACE}/updateState',payload:{editLoading:true}})
    const url = values.id ? '#{NAMESPACE}/update' : '#{NAMESPACE}/save';
    dispatch({ type: url, payload: values }).then((result) => {
      if (result && result.code === 10000) {
        message.success(result.msg);
        this.setState({ editTitle: '', editVisible: false });
        dispatch({type:'#{NAMESPACE}/updateState',payload:{current:{},editLoading:false}})
        dispatch({ type: '#{NAMESPACE}/queryList' });
        resetFields();
      } else {
        dispatch({type:'#{NAMESPACE}/updateState',payload:{editLoading:false}})
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
    const columns = #{COLUMNS}


    return (
      <div className="container">
        <Filter ref={this.filterRef}/>
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
            dispatch({ type: '#{NAMESPACE}/updateState', payload: { current: {} } });
            this.setState({ editVisible: false });
          }}
          onOk={(values, resetFields) => {
            this.saveForm(values, resetFields);
          }}/>
        <Details
          loading={detailsLoading}
          detailVisible={detailVisible}
          current={current}
          onCancel={() => {
            dispatch({ type: '#{NAMESPACE}/updateState', payload: { current: {} } });
            this.setState({ detailVisible: false });
          }}/>
      </div>
    );
  }
}

export default List;
