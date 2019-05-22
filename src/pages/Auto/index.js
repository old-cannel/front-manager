import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, message, Badge, Divider, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import ClassForm from './Form';

import styles from './index.less';

const FormItem = Form.Item;
let tempFilterKey = null;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ auto = {}, loading,menu={} }) => ({
  auto,
  loading: loading.models.auto,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    preUpdateClazz: {},
    modalLoading: false,
    hasPage:"",
    routerList:[]
  };

  handleText = text => {
    let textview = text;
    if (textview === undefined || textview == '') {
      textview = '';
    } else if (textview.length > 10) {
      textview = `${textview.substring(0, 10)}...`;
    }
    return <div title={text}>{textview}</div>;
  };

  handleUpdTime = text => {
    if (text != undefined) {
      return moment(text).format('YYYY-MM-DD');
    }
  };

  columns = [
    {
      title: '主表名',
      dataIndex: 'tableName',
      render: text => {
        return this.handleText(text);
      },
    },
    {
      title: '路由',
      dataIndex: 'fileUrl',
    },
    {
      title: '名称',
      dataIndex: 'tableComment',
      render: text => {
        return this.handleText(text);
      },
    },
    {
      title: '操作人',
      dataIndex: 'fullName',
      render: text => {
        return this.handleText(text);
      },
    },
    {
      title: '操作时间',
      dataIndex: 'addTime',
      render: text => {
        return this.handleUpdTime(text);
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleRemove({ id: record.id })}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {}

  // 分页相关数据改变
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'auto/fetch',
      payload: params,
    });
  };

  // 列表条件检索
  handleSearch = e => {
    e && e.preventDefault();
    const {
      dispatch,
      form,
      auto: { data },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'auto/fetch',
        payload: {
          ...values,
          ...data.pagination,
        },
      });
    });
  };

  // 条件检索表单重置
  handleFormReset = () => {
    const {
      form,
      dispatch,
      auto: { data },
    } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'auto/fetch',
      payload: {},
    });
  };

  // 打开/关闭抽屉
  handleModalVisible = (flag, clazz = {}) => {
    const { dispatch,menu } = this.props;
    let menuParent = [];
    if (!!flag) {
      dispatch({
        type: 'auto/tableList'
      });
    }
    this.setState({
      modalVisible: !!flag,
      routerList:menu.menuData,
      hasPage:""
    });
  };

  // 新增
  handleAdd = fields => {
    // this.changeModalLoadingStatus(true);
    const { dispatch } = this.props;
    dispatch({
      type: 'auto/add',
      payload: {
        ...fields,
      },
      success: res => {
        message.success('添加成功');
        this.handleSearch();
        // this.changeModalLoadingStatus(false);
        this.handleModalVisible(false);
      },
      fail: res => {
        message.error('添加失败');
        // this.changeModalLoadingStatus(false);
      },
    });
  };

  checkRouter = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auto/check',
      payload: {
        ...fields,
      },
      success: res => {
        this.addFramePage(fields);
        this.handleAdd(fields);
      },
      fail: res => {
        message.error(res.msg);
        // this.changeModalLoadingStatus(false);
      },
    });
  };

  addFramePage = fields =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'auto/addFrame',
      payload: {
        ...fields,
      },
    });
  };

  // 删除
  handleRemove = fields => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '删除',
      content: '确认删除吗',
      onOk: () => {
        dispatch({
          type: 'auto/remove',
          payload: {
            ...fields,
          },
          success: res => {
            message.success('删除成功');
            this.handleSearch();
          },
          fail: res => {
            message.error(res.result);
          },
        });
      },
    });
  };

  // 更改抽屉保存按钮加载状态
  changeModalLoadingStatus = flag => {
    this.setState({
      modalLoading: !!flag,
    });
  };

  //清空新增页面数据
  cleanRecord = (record,tableList) =>{
    this.setState({
      record:record||{},
      tableList:tableList||[],
      hasPage:"",
    });
  };

  selectHasPage = (value) => {
    this.setState({
      hasPage:value
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;


    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="主表名">
              {getFieldDecorator('tableName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('tableComment')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { auto = {}, loading, dispatch, form} = this.props;
    const { data,  filterKey, tableData } = auto;

    const { selectedRows, modalVisible, modalLoading, hasPage,routerList } = this.state;

    // 刷新条件检索框
    if (tempFilterKey == null) {
      tempFilterKey = filterKey;
    } else if (tempFilterKey != filterKey) {
      form.resetFields();
      this.setState({
        formValues: {},
      });
      tempFilterKey = filterKey;
    }

    const formProps = {
      dispatch,
      width: '85%',
      visible: modalVisible,
      modalLoading,
      hasPage,
      record:{},
      tableList:tableData,
      routerList,
      cleanData:this.cleanRecord,
      changeHasPage:this.selectHasPage,
      onClose: () => {
        this.handleModalVisible(false);
      },
      onOk: fields => {
        // 添加
        this.handleAdd(fields);
      },
      onCheck:value=>{
        this.checkRouter(value);
      },
      onFramePage:value=>{
        this.addFramePage(value);
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              selecter={false}
            />
          </div>
        </Card>
        <ClassForm {...formProps} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
