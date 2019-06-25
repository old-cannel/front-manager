import React, { Component } from 'react';
import { Button, Form, Input, Popconfirm, Table, Select, Tooltip, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;


@connect(({}) => ({}))
class EditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationList: [],
    };
  }

  componentDidMount() {
    const { list=[] ,selfRef} = this.props;
    if(selfRef){selfRef(this)}
    this.setState({ operationList: list });

  }

  // 新增一行
  addRow=()=>{
    let {operationList} = this.state;
    operationList.push({id:`PAGE_ID${Math.random()}`,name:"", code:"",sysApis:[] });
    this.setState({operationList})
  }

  // 删除
  confirmDel = (id) => {
    let { operationList } = this.state;
    this.setState({ operationList: operationList.filter(item => item.id !== id) });
  };

  // 数据绑定
  onChange=(value,id,type)=>{
    const { operationList } = this.state;
    let operationListCopy=[]
    operationList.forEach(item=>{
      if(item.id===id){
        switch (type) {
          case 1:
            item.name=value;
            break;
          case 2:
            item.code=value;
            break;
          case 3:
            item.sysApis=value;
            break;
          default:
            break;
        }
      }
      operationListCopy.push(item)
    })
    this.setState({operationList:operationListCopy})
  }

  renderDate=()=>{
    const { operationList } = this.state;
    return operationList;
  }

  checkCode = (rule, value, callback,record) => {
    // 列表验证
    const { operationList } = this.state;
    if(operationList.filter(item=>item.code===value).length>=2){
      callback('编码已存在');
      return false;
    }
    const {dispatch}=this.props
    dispatch({ type: 'sysmenu/checkCode', payload: { code: value,id:record.id } }).then(({  result }) => {
      if (result > 0) {
        callback('编码已存在');
      } else {
        callback();
      }
    });
   return true
  };



  render() {
    const {
      operationList,
    } = this.state;
    const {form:{getFieldDecorator},apiList}=this.props
    const columns = [
      {
        title: '名称',
        dataIndex:'name',
          width:300,
        key: 'name',
        render:(text,record)=>{
          const operation =
            <FormItem>
              {getFieldDecorator(`operationName${record.id}`, {
               initialValue: text,
               rules: [
                 { 'required': true, 'message': '名称不能为空' },
               ],
             })(<Input onChange={(e)=>{this.onChange(e.target.value,record.id,1)}} maxLength={100} style={{ width: 250 }} placeholder='请输入名称' />)}
            </FormItem>
          return  operation
        }
      }, {
        title:<div>编码  <Tooltip placement="topLeft" title="编码对应页面权限组件<Authorize>中code的值"> <Icon type="question-circle" />  </Tooltip> </div>,
        dataIndex:'code',
        key: 'code',
          width:300,
        render:(text,record)=>{
          const operation =
            <FormItem>
              {getFieldDecorator(`operationCode${record.id}`, {
                initialValue: text,
                rules: [
                  { 'required': true, 'message': '编码不能为空' },
                  { validator: (rule, value, callback)=>this.checkCode(rule, value, callback,record) },
                ],
              })(<Input onChange={(e)=>{this.onChange(e.target.value,record.id,2)}} maxLength={100} style={{ width: 250 }} placeholder='请输入编码' />)}
            </FormItem>
          return  operation
        }
      },{
        title: 'API',
        dataIndex:'sysApis',
        key: 'sysApis',
          width:300,
        render:(text,record)=>{
          const operation =
            <FormItem>
              {getFieldDecorator(`operationApis${record.id}`, {
                initialValue: text,
              })(
                <Select
                  mode="multiple"
                  onChange={(value)=>{this.onChange(value,record.id,3)}}
                  showSearch
                  style={{ width: 250 }}
                  placeholder="请选择api"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||  option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    apiList.map(item=>{
                      return  <Option key={item.id} value={item.id}>{item.name}</Option>
                    })
                  }
                </Select>)}
            </FormItem>
          return  operation
        }
      },{
        title: '操作',
        render:(text,record)=>{
          const operation =
            <Popconfirm
              title="您确认删除吗？"
              onConfirm={()=>{this.confirmDel(record.id)}}
              okText="确认"
              cancelText="取消"
            >
              <a style={{marginTop: -24,position: "absolute"}} href="javascript:void(0)">删除</a>
            </Popconfirm>
          return  operation
        }
      }
    ]

    return (
      <div>
        <Button type="primary" onClick={()=>{this.addRow()}}>新增操作</Button>
        <Table
          scroll={{ y: 500 }}
          pagination={{ hideOnSinglePage: true, pageSize: 99999999 }}
          columns={columns}
          rowKey={record => record.id}
          dataSource={operationList}
        />
      </div>
    );
  }
}

export default EditList;
