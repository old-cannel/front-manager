import React, {PureComponent} from 'react';
import {Row, Form, Drawer, Table, Input, span, Select,
  Divider, Button, message, Radio,Tree,Modal,Checkbox } from 'antd'
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 5},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 17},
  },
};
const { TreeNode } = Tree;
const Option = Select.Option;
@Form.create()
class ClassForm extends React.Component {
  state = {
    visible:false,
    parentRouter:"",
    router:"",
    chinaValue:"",
    engValue:"",
    tempParentRouter:"",
    tempRouter:"",
    tempChinaValue:"",
    tempEngValue:"",
    preParentRouter:"",
    columnList:[]
  };

  //table表中input输入
  sortChange = (e,text,record) => {
    const {columnList=[] } = this.state;
    for(let i=0; i<columnList.length; i++) {
      if(columnList[i].tableColumn==record.tableColumn) {
        columnList[i][text] = Math.round((e.target.value+"").replace(/[^0-9]/,''));
        break;
      }
    }
    this.setState({
      columnList,
    });
  };

  //字段名称输入
  columnNameChange = (e,text,record) => {
    const {columnList=[] } = this.state;
    for(let i=0; i<columnList.length; i++) {
      if(columnList[i].tableColumn==record.tableColumn) {
        columnList[i][text] = e.target.value;
        break;
      }
    }
    this.setState({
      columnList,
    });
  };

  //复选框选项
  checkboxList = (text, record, type) => {
    let flag = false;
    if(text && text=='1'){
      flag = true;
    }
    return <Checkbox defaultChecked={flag} onChange={e=>this.checkboxChange(e,record,type)}></Checkbox>
  };

  //复选框切换
  checkboxChange = (e,record,type) => {
    const {columnList=[] } = this.state;
    let flag = 0;
    if(e.target.checked) {
      flag = 1;
    }
    for(let i=0; i<columnList.length; i++) {
      if(columnList[i].tableColumn==record.tableColumn) {
        columnList[i][type] = flag;
        break;
      }
    }
  };

  //路由输入
  changeRouterName = value => {
    this.setState({
      tempRouter:value.target.value.replace(/[^a-zA-Z]/g,"")
    });
  };

  //中文名称输入
  changeChinaValue = value => {
    this.setState({
      tempChinaValue:value.target.value
    });
  };

  //英文名称输入
  changeEngValue = value => {
  this.setState({
    tempEngValue:value.target.value.replace(/[^a-zA-Z]/g,"")
  });
};

  //java类型选项
  javaTypeList = (text,record,type) => {
    return <Select style={{width:'90%'}} getPopupContainer={triggerNode => triggerNode.parentNode}
                   defaultValue={text}
                   onSelect={e => {this.changeSelect(e,type,record)}}>
      <Option value={"String"}>String</Option>
      <Option value={"Integer"}>Integer</Option>
      <Option value={"Double"}>Double</Option>
      <Option value={"BigDecimal"}>BigDecimal</Option>
      <Option value={"Float"}>Float</Option>
      <Option value={"Date"}>Date</Option>
    </Select>
  };

  //下拉选项切换
  changeSelect = (e,text,record) => {
    const {columnList=[] } = this.state;
    for(let i=0; i<columnList.length; i++) {
      if(columnList[i].tableColumn==record.tableColumn) {
        columnList[i][text] = e;
        break;
      }
    }
  };

  //取消
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  //确定
  handleOk = e => {
    const {tempRouter, tempParentRouter, tempChinaValue, tempEngValue} = this.state;
    if(!tempRouter){
      message.error("路由不能为空");
      return;
    }else if(tempRouter.indexOf("/")>=0){
      message.error("路由中禁止输入/");
      return;
    }
    if(!tempChinaValue){
      message.error("中文名称不能为空");
      return;
    }else if(tempChinaValue){
      var han = /^[\u4e00-\u9fa5]+$/;
      if (!han.test(tempChinaValue)) {
        message.error("中文名称含有非中文字符");
        return;
      }
    }
    if(!tempEngValue){
      message.error("英文名称不能为空");
      return;
    }
    this.setState({
      visible: false,
      parentRouter:tempParentRouter[0],
      router:tempRouter,
      chinaValue:tempChinaValue,
      engValue:tempEngValue
    });
  };

  //选中路由
  selectRouter = (value) =>{
    const { parentRouter, router, chinaValue, engValue, preParentRouter } = this.state;
    if(parentRouter == value[0]) {
      this.setState({
        visible:true,
        tempParentRouter:value,
        tempRouter:router,
        tempChinaValue:chinaValue,
        tempEngValue:engValue
      });
    }else if(value.length==0){
      this.setState({
        visible:true,
        tempParentRouter:preParentRouter,
      });
    }else{
      this.setState({
        visible:true,
        tempParentRouter:value,
        tempRouter:"",
        tempChinaValue:"",
        tempEngValue:"",
        preParentRouter:value
      })
    }
  };

  initState =() => {
    const { cleanData } = this.props;
    this.setState({
      parentRouter:"",
      router:"",
      chinaValue:"",
      engValue:"",
      tempParentRouter:"",
      tempRouter:"",
      tempChinaValue:"",
      tempEngValue:"",
      columnList:[]
    });
  };

  //查询方式
  queryModeList = (text,record,type) => {
    return <Select style={{width:'80%'}} getPopupContainer={triggerNode => triggerNode.parentNode}
                   defaultValue={text}
                   onSelect={e => {this.changeSelect(e,type,record)}}>
      <Option value={"="}>=</Option>
      <Option value={"like"}>like</Option>
    </Select>
  };

  componentTypeList = (text,record,type) => {
    return <Select style={{width:'90%'}} getPopupContainer={triggerNode => triggerNode.parentNode}
                   defaultValue={text} placeholder="请选择"
                   onChange={e=>{this.changeSelect(e,"componentType",record)}}>
      <Option value={"Input"}>Input</Option>
      <Option value={"InputNumber"}>InputNumber</Option>
      <Option value={"Radio"}>Radio</Option>
      <Option value={"Select"}>Select</Option>
      <Option value={"Checkbox"}>Checkbox</Option>
      <Option value={"DatePicker_date"}>DatePicker_date</Option>
      <Option value={"DatePicker_datetime"}>DatePicker_datetime</Option>
    </Select>
  };

  render = () => {
    const {
      form: {getFieldDecorator, validateFields},
      record = {},
      tableList = [],
      modalLoading,
      cleanData,
      dispatch,
      firstFlag,
      hasPage,
      routerList,
      ...drawerProps
    }=this.props;
    const {visible=false,
      parentRouter="",
      router="",
      chinaValue="",
      engValue="",
      tempParentRouter="",
      tempRouter="",
      tempChinaValue="",
      tempEngValue="",
    columnList=[]} = this.state;
    const submit = () => {
      validateFields((errors, values) => {
        if (errors) {
          return;
        }
        //路由非空验证
        if(!values.parentRouter) {
          message.error("请选择路由");
          return;
        }
        //表字段验证
        let errorFlag = 0;
        if(hasPage=="1" && columnList) {
          if(!values.tableName) {
            message.error("请选择数据库表");
            return;
          }
          const componentType = ["Radio","Select","Checkbox"];
          for(let i=0; i<columnList.length; i++) {
            //java类型验证
            if(!columnList[i].javaType){
              message.error(columnList[i].tableColumn+" java类型不可为空");
              errorFlag = 1;
              break;
            }
            //查询方式验证
            if(columnList[i].queryFlag=="1" && !columnList[i].queryMode) {
              message.error(columnList[i].tableColumn+" 查询方式不可为空");
              errorFlag = 1;
              break;
            }
            //组件类型验证
            if(!columnList[i].componentType
              && (columnList[i].queryFlag=='1' || columnList[i].editFlag=='1')){
              message.error(columnList[i].tableColumn+" 组件类型不可为空");
              errorFlag = 1;
              break;
            }
            //选项或字典值验证
            if(componentType.indexOf(columnList[i].componentType)>=0
               && !columnList[i].componentData) {
              message.error(columnList[i].tableColumn+"选项或字典值不可为空");
              errorFlag = 1;
              break;
            }
          }
          if(errorFlag == 1){
            return;
          }
          for(let i=0; i<columnList.length; i++) {
            if(columnList[i].componentType) {
              let obj = {type:columnList[i].componentType};
              columnList[i].component=obj;
            }
            if(componentType.indexOf(columnList[i].componentType)>=0){
              if(columnList[i].componentData.indexOf(":")>=0) {
                columnList[i].component.dataFrom = "1";
                let kvArr = columnList[i].componentData.split(";");
                let dataSource = [];
                for(let vo of kvArr) {
                  let kv = vo.split(":");
                  let dataSourceObj = {value:kv[0],label:kv[1]};
                  dataSource.push(dataSourceObj);
                }
                columnList[i].component.dataSource = dataSource;
              }else{
                columnList[i].component.dataFrom = "2";
                columnList[i].component.column = columnList[i].componentData;
              }
            }
          }
          values.tableInfo = columnList;
        }
        values.router = "/"+values.router;
        values.parentRouter = values.parentRouter.substring(5);
        values.fileUrl = values.parentRouter+values.router;
        values.hasPage = hasPage;
        let menuName = [];
        let obj1 = {
          type:"zh-CN",
          name:values.chinaValue
        };
        let obj2 = {
          type:"en_US",
          name:values.engValue
        };
        menuName.push(obj1);
        menuName.push(obj2);
        values.menuName = menuName;
        values.tableComment = values.chinaValue;
        console.log(values);
        if(hasPage == "1"){
          drawerProps.onCheck({
            ...record,
            ...values,
          });
        }else{
          drawerProps.onFramePage({
            ...record,
            ...values,
          })
        }

      });
    };

    const tableStyle = {
      marginRight: '20px',
    };
    //查询所选表对应字段信息
    const searchColumn = (value) => {
      const {dispatch,hasPage} = this.props;
      if(hasPage == '1'){
        dispatch({
          type: 'auto/tableColumn',
          payload: {
            tableName: value,
          },
          success: (ele)=> {
            this.setState({
              columnList:ele
            });
          }
        });
      }
    };

    //关闭抽屉
    const closeDrawer = () => {
      drawerProps.onClose();
      this.initState();
    };

    //选择生成方式
    const selectChange = (value) => {
      let hasPage = value.target.value;
      drawerProps.changeHasPage(hasPage);
      this.initState();
    };

    //路由树
    const loop = (data,pre) =>
      data.map(item => {
        if (item.path && item.children && item.children.length>0) {
          return (
            <TreeNode key={`/root${item.path}`} title={item.path.replace(pre,"")}>
              {loop(item.children,item.path.replace(pre,""))}
            </TreeNode>
          );
        }
        return <TreeNode key={`/root${item.path}`} title={item.path.replace(pre,"")} />;
      });
    const columns = [{
      title: '表字段',
      dataIndex: 'tableColumn',
      key:'tableColumn',
    }, {
      title: '字段类型',
      dataIndex: 'columnType',
      key:'columnType',
    }, {
      title: '字段名称',
      dataIndex: 'columnName',
      key:'columnName',
      render:(text,record)=><Input style={{width:'60%'}} maxLength={10}
             value={text} onChange={e=>{this.columnNameChange(e,"columnName",record)}}/>
    },{
      title: '字段长度',
      dataIndex: 'columnLength',
      key:'columnLength',
      width:120,
      render:(text,record)=><Input style={{width:'60%'}}
            value={text} onChange={e=>{this.sortChange(e,"columnLength",record)}}/>
    }, {
      title: '字段精度',
      dataIndex: 'scale',
      key:'scale',
      width:120,
      render:(text,record)=><Input style={{width:'40%'}}
            value={text} onChange={e=>{this.sortChange(e,"scale",record)}}/>
    }, {
      title: 'java类型',
      dataIndex: 'javaType',
      key:'javaType',
      render:(text,record)=> this.javaTypeList(text,record,"javaType"),
    }, {
      title: '不可为空',
      dataIndex: 'notNullFlag',
      key:'notNullFlag',
      width:50,
      render: (text,record) => this.checkboxList(text,record,"notNullFlag"),
    },{
      title: '列表',
      dataIndex: 'listFlag',
      key:'listFlag',
      width:50,
      render: (text,record) => this.checkboxList(text,record,"listFlag"),
    },{
      title: '查询',
      dataIndex: 'queryFlag',
      key:'queryFlag',
      width:50,
      render: (text,record) => this.checkboxList(text,record,"queryFlag"),
    },{
      title: '插入',
      dataIndex: 'insertFlag',
      key:'insertFlag',
      width:50,
      render: (text,record) => this.checkboxList(text,record,"insertFlag"),
    },{
      title: '编辑',
      dataIndex: 'editFlag',
      key:'editFlag',
      width:50,
      render: (text,record) => this.checkboxList(text,record,"editFlag"),
    },{
      title: '排序',
      dataIndex: 'sort',
      key:'sort',
      width:120,
      render: (text,record) => {
        return <Input style={{width:'40%'}} value={text} onChange={e=>{this.sortChange(e,"sort",record)}}></Input>
      }
      ,
    }, {
      title: '查询方式',
      dataIndex: 'queryMode',
      key:'queryMode',
      width:150,
      render:(text,record) => this.queryModeList(text,record,"queryMode"),
    }, {
      title: '组件类型',
      dataIndex: 'componentType',
      key:'componentType',
      width:150,
      render:(text,record) => this.componentTypeList(text,record,"componentType"),
    }, {
      title: '选项或字典值',
      dataIndex: 'componentData',
      key:'componentData',
      render:(text,record)=><Input
           value={text} onChange={e=>{this.columnNameChange(e,"componentData",record)}}/>
    }];
    return (
      <Drawer {...drawerProps} onClose={closeDrawer} destroyOnClose>
        <Form {...formItemLayout} style={tableStyle}>
          <Form.Item label="生成方式">
            {getFieldDecorator('hasPage', {
              initialValue: hasPage,
              rules: [{required: true, message: '请选择生成方式'}],
            })(<Radio.Group onChange={(value)=> {selectChange(value)}}>
              <Radio value="2">只生成路由</Radio>
              <Radio value="1">生成页面</Radio>
            </Radio.Group>)}
          </Form.Item>
          {hasPage && <div>
            {hasPage=="1" && <Form.Item label="数据库表：">
              {getFieldDecorator('tableName', {
                initialValue: record.tableName,
              })(
                <Select placeholder="请选择数据库表" style={{width: 200}} showSearch
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        onChange={value => {searchColumn(value)}}
                        filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                  {tableList && tableList.map(item => (
                    <Option value={item.keyName}>{item.valueName}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>}
            <Form.Item label="路由">
              {getFieldDecorator('fileUrl')(<Tree
                className="draggable-tree"
                draggable
                blockNode
                onSelect={(value)=>{this.selectRouter(value)}}
              >
                <TreeNode key={"/root"} title={"/root"}>
                  {loop(routerList,"")}
                </TreeNode>

              </Tree>)}
            </Form.Item>
            {parentRouter &&
            <Form.Item label="父路由">
              {getFieldDecorator('parentRouter',{
                initialValue: parentRouter,
                rules: [{required: true, message: '请选择父路由'}],
              })(<Input placeholder="请输入" disabled={true}/>)}
            </Form.Item>
            }
            {parentRouter &&
            <Form.Item label="路由">
              {getFieldDecorator('router', {
                initialValue: router,
                rules: [{required: true, message: '请输入路由'}],
              })(<Input placeholder="请输入" disabled={true}/>)}
            </Form.Item>
            }
            {parentRouter &&
            <Form.Item label="中文名称">
              {getFieldDecorator('chinaValue', {
                initialValue: chinaValue,
                rules: [{required: true, message: '请输入中文名称'}],
              })(<Input placeholder="请输入" disabled={true}/>)}
            </Form.Item>
            }
            {parentRouter &&
            <Form.Item label="英文名称">
              {getFieldDecorator('engValue', {
                initialValue: engValue,
                rules: [{required: true, message: '请输入英文名称'}],
              })(<Input placeholder="请输入" disabled={true}/>)}
            </Form.Item>
            }
            {hasPage=="1"&&<Table columns={columns} pagination={ false }
                   dataSource={columnList} size="middle"/>}
          </div>}
        </Form>
        <Modal
          title="路由设置"
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
          <Form.Item label="父路由">
            {tempParentRouter}
          </Form.Item>
          <Form.Item label="路由">
            <Input type={Text} placeholder="请输入" value={tempRouter} onChange={value=>{this.changeRouterName(value)}}/>
          </Form.Item>
            <Form.Item label="中文名称">
              <Input placeholder="请输入" value={tempChinaValue} defaultValue={tempChinaValue} onChange={value=>{this.changeChinaValue(value)}}/>
            </Form.Item>
          <Form.Item label="英文名称">
            <Input placeholder="请输入" value={tempEngValue} onChange={value=>{this.changeEngValue(value)}}/>
          </Form.Item>
          </Form>
        </Modal>

        <div style={{height: '45px',}}></div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: '99999',
          }}>
          <Button onClick={closeDrawer} style={{marginRight: 8}}>
            取消
          </Button>
          <Button onClick={submit} loading={modalLoading} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    );
  };
}
export default ClassForm;