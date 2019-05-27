const fs = require('fs');
const process = require('process');
const utils = require('./utils.js');

//项目跟路径
const bashPath = process.cwd();

//组件页面位置 和 models
const pagesPath = `${bashPath}/src/pages`;
//service 文件位置
const serverPath = `${bashPath}/src/services`;

const routerPath = `${bashPath}/config`;

//菜单名称 国际化处理
const menuLocales = [
  {
    type: 'zh-CN',
    path: `${bashPath}/src/locales/zh-CN`,
  },
  {
    type: 'en-US',
    path: `${bashPath}/src/locales/en-US`,
  },
];

const filterTemp = './scripts/generateCode/modules/template/filterTemp.js.temp';
const listTemp = './scripts/generateCode/modules/template/listTemp.js.temp';
const addTemp = './scripts/generateCode/modules/template/addTemp.js.temp';
const editTemp = './scripts/generateCode/modules/template/editTemp.js.temp';
const detailsTemp = './scripts/generateCode/modules/template/detailsTemp.js.temp';
const indexTemp = './scripts/generateCode/modules/template/indexTemp.js.temp';
const serverTemp = './scripts/generateCode/modules/template/serverTemp.js.temp';
const modelsTemp = './scripts/generateCode/modules/template/modelsTemp.js.temp';

//Filter.js  过滤(create)
//List.js 列表(create)
//Edit.js  新增修改(create)
//Details.js 详情(create)
//index.js 入口(create)
//service.js (update)
//models 页面models(create)
//api.js api (update)
//router.config.js (update)
const generateCodeHandle = param => {
  //父路由为空 为 /
  param.parentRouter = param.parentRouter ? param.parentRouter : '/';
  //生成 filter
  generateFactory(param, 'filter');
  //生成list
  generateFactory(param, 'list');
  //生成编辑页面
  generateFactory(param, 'edit');
  //生成新增页面
  generateFactory(param, 'add');
  //生成详情页面
  generateFactory(param, 'details');
  //生成入口文件 index.js
  generateFactory(param, 'index');
  //生成入service service.js
  generateFactory(param, 'service');
  //生成models
  generateFactory(param, 'models');
  //生成路由
  generateRouter(param);
  //生成菜单名称（带国际化）
  generateLocalesMenus(param);
};

const generateFactory = (param, type) => {
  //生成页面
  if (param.hasPage === '1') {
    const namespace = `${param.parentRouter}${param.router}`.replace(/\//g, '');
    //1.按照生成的文件不同选择相应生成的策略
    let switchStrategy = null;
    switch (type) {
      case 'filter':
        switchStrategy = generateFilter;
        break;
      case 'list':
        switchStrategy = generateList;
        break;
      case 'add':
        switchStrategy = generateAdd;
        break;
      case 'edit':
        switchStrategy = generateEdit;
        break;
      case 'details':
        switchStrategy = generateDetails;
        break;
      case 'index':
        switchStrategy = generateIndex;
        break;
      case 'service':
        switchStrategy = generateService;
        break;
      case 'models':
        switchStrategy = generateModels;
        break;
      default:
        break;
    }
    //2.生成要生成的代码 result[0]:文件路径 result[1]:文件名 result[2]:写入内容
    const result = switchStrategy(param, namespace);

    //3.写入文件
    const path = utils.resetPath(result[0]);
    const fullPath = `${path}${result[1]}`;
    utils.writer(utils.formatPath(path), fullPath, result[2]);

    //4.格式化代码 selint 效验
    utils.formatCode(fullPath);
  }
};

// 生成Filter.js
const generateFilter = (param, namespace) => {
  let result = fs.readFileSync(filterTemp, 'utf8');

  //时间筛选放在后面
  let tableInfo = [];
  let tableInfoDate = [];
  param.tableInfo.forEach(item => {
    if (item.queryFlag === '1') {
      if (
        item.component.type === 'DatePicker_datetime' ||
        item.component.type === 'DatePicker_date'
      ) {
        tableInfoDate.push(item);
      } else {
        tableInfo.push(item);
      }
    }
  });
  const row = tableInfo.concat(tableInfoDate);
  //生成筛选页面表单
  let formItemStr = '';
  let dateHandle = '';
  let timeSearch = '';
  row.forEach(item => {
    if (item.queryFlag === '1') {
      const createRes = utils.renderFilterFormItem(item);
      if (
        item.component.type === 'DatePicker_date' ||
        item.component.type === 'DatePicker_datetime'
      ) {
        timeSearch += `payload.${item.javaName}=''\r\n;`;
      }
      formItemStr += createRes[0];
      dateHandle += createRes[1];
    }
  });

  //模板替换
  result = result
    .replace(' #{DATEHANDLE}', dateHandle)
    .replace('#{IMPORTFILTERITEM}', formItemStr)
    .replace(/#{NAMESPACE}/g, namespace);
  //global 是否引用
  if (result.indexOf('props.dictInfo') > 0) {
    result = result
      .replace('#{NAMESPANCE}', 'global')
      .replace(' #{NAMESPANCEITEM}', 'dictInfo:global.dictInfo');
  }
  result = result.replace('#{NAMESPANCE}', '').replace('#{NAMESPANCEITEM}', '');

  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);
  //动态常量引入
  const dynamicConstant = utils.dynamicConstant(result);
  result = result.replace('#{CONSTANT}', dynamicConstant);
  result = result.replace('#{TIMESEARCH}', timeSearch);

  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'Filter.js';
  return [path, fileName, result];
};

//生成列表
const generateList = (param, namespace) => {
  let result = fs.readFileSync(listTemp, 'utf8');
  let columns = '[';
  param.tableInfo.forEach(item => {
    let str = '';
    if (item.component.type === 'Select') {
      if (item.component.dataFrom === '2') {
        str = `<DictLabel type={"${item.component.column}"} value={text}/>`;
      } else if (item.component.dataFrom === '1') {
        str = `<DictLabel source={${JSON.stringify(item.component.dataSource)}} value={text}/>`;
      }
    }

    if (item.listFlag === '1') {
      if (str) {
        columns += `{
          title: '${item.columnName}',
          dataIndex:'${item.javaName}',
          key: '${item.javaName}',
          render:text=>{
            return ${str}
          }
        },`;
      } else {
        columns += `{
          title: '${item.columnName}',
          dataIndex:'${item.javaName}',
          key: '${item.javaName}',
        },`;
      }
    }
  });
  columns += `{
          title: '操作',
          render:(text,record)=>{
            const operation =
                <span>
                    <a  href="javascript:void(0)"  onClick={()=>{this.details(record)}}>详情</a> <Divider type="vertical" />
                    <a  href="javascript:void(0)"  onClick={()=>{this.edit(record)}}>修改</a> <Divider 
                    type="vertical" />
                    <Popconfirm
                        title="您确认删除吗？"
                        onConfirm={()=>{this.confirmDel(record.id)}}
                        okText="确认" cancelText="取消" >
                          <a  href="javascript:void(0)">删除</a>
                     </Popconfirm>
                  </span>
            return  operation
          }
        },`;

  columns += ']';
  //带有checkbox
  if (param.tableType === '2') {
    result = result
      .replace('#{ROWSELECTION}', `rowSelection={rowSelection}`)
      .replace(
        '#{DELETEBUTTON}',
        `<Button style={{marginLeft:20}} onClick={()=>{
            const { selectedRowKeys } = this.state;
            if(selectedRowKeys && selectedRowKeys.length===0){
              message.info('请选择要删除的数据')
            }else{
              confirm({
              okText: '确认',
              cancelText:'取消',
              content:<div>您确认删除吗？</div>,
              onOk:()=> {
                  let ids=""
                  selectedRowKeys.forEach(item=>{
                    ids+=item+","
                  })
                   ids= ids.substring(0,ids.length-1)
                  this.props.dispatch({ type: '${namespace}/delete', payload: { id:ids } }).then((result)=>{
                      if(result && result.code===10000){
                        this.setState({selectedRowKeys:[]})
                      }
                  });
              }
            });
            }
          }} type="danger"> 删除 </Button>`
      )
      .replace('#{SELECTEDROWKEYS}', 'selectedRowKeys:[]')
      .replace(
        '#{ROWSELECTIONFUNC}',
        `const rowSelection = {
        onChange: (selectedRowKeys) => {
          this.setState({ selectedRowKeys });
        },
      };`
      );
  }
  result = result
    .replace('#{ROWSELECTION}', ``)
    .replace('#{DELETEBUTTON}', ``)
    .replace('#{SELECTEDROWKEYS}', ``)
    .replace('#{ROWSELECTIONFUNC}', ``);
  result = result.replace('#{COLUMNS}', columns).replace(/#{NAMESPACE}/g, namespace);
  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);
  //动态常量引入
  const dynamicConstant = utils.dynamicConstant(result);
  result = result.replace('#{CONSTANT}', dynamicConstant);

  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'List.js';
  return [path, fileName, result];
};

//生成编辑页面
const generateEdit = (param, namespace) => {
  let result = fs.readFileSync(editTemp, 'utf8');
  //react 引入
  let importTemp = '';

  //其他模块引入
  let importDynamic = '';
  //定义常量
  let constant = '';

  //FilterItem
  let importFilterItem = '';

  //如果编辑框小于6个 一行一个 大于一行2个显示
  const editLength = param.tableInfo.filter(editItem => editItem.editFlag === '1').length;
  const drawerWidth = editLength < 6 ? 550 : 740;

  //生成编辑页面表单
  let formItemStr = '';
  let dateHandle = '';
  param.tableInfo.forEach(item => {
    if (item.editFlag === '1') {
      const createRes = utils.renderEditFormItem(item, editLength);
      formItemStr += createRes[0];
      dateHandle += createRes[1];
    }
  });

  //模板替换
  result = result
    .replace('#{DRAWERWIDTH}', drawerWidth)
    .replace('#{IMPORTFILTERITEM}', formItemStr)
    .replace('#{DATEHANDLE}', dateHandle)
    .replace(/#{NAMESPACE}/g, namespace);
  //global 是否引用
  if (result.indexOf('props.dictInfo') > 0) {
    result = result
      .replace('#{NAMESPANCE}', 'global')
      .replace(' #{NAMESPANCEITEM}', 'dictInfo:global.dictInfo');
  }
  result = result.replace('#{NAMESPANCE}', '').replace('#{NAMESPANCEITEM}', '');
  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);
  //动态常量引入
  const dynamicConstant = utils.dynamicConstant(result);
  result = result.replace('#{CONSTANT}', dynamicConstant);

  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'Edit.js';
  return [path, fileName, result];
};

//生成新增页面
const generateAdd = (param, namespace) => {
  let result = fs.readFileSync(addTemp, 'utf8');
  //react 引入
  let importTemp = '';

  //其他模块引入
  let importDynamic = '';
  //定义常量
  let constant = '';

  //FilterItem
  let importFilterItem = '';

  //如果编辑框小于6个 一行一个 大于一行2个显示
  const editLength = param.tableInfo.filter(
    editItem => editItem.insertFlag === '1' && editItem.publicFlag === '0'
  ).length;
  const drawerWidth = editLength < 6 ? 550 : 740;

  //生成编辑页面表单
  let formItemStr = '';
  let dateHandle = '';
  param.tableInfo.forEach(item => {
    if (item.insertFlag === '1' && item.publicFlag === '0') {
      const createRes = utils.renderAddFormItem(item, editLength);
      formItemStr += createRes[0];
      dateHandle += createRes[1];
    }
  });

  //模板替换
  result = result
    .replace('#{DRAWERWIDTH}', drawerWidth)
    .replace('#{IMPORTFILTERITEM}', formItemStr)
    .replace('#{DATEHANDLE}', dateHandle)
    .replace(/#{NAMESPACE}/g, namespace);

  //global 是否引用
  if (result.indexOf('props.dictInfo') > 0) {
    result = result
      .replace('#{NAMESPANCE}', 'global')
      .replace(' #{NAMESPANCEITEM}', 'dictInfo:global.dictInfo');
  }
  result = result.replace('#{NAMESPANCE}', '').replace('#{NAMESPANCEITEM}', '');

  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);
  //动态常量引入
  const dynamicConstant = utils.dynamicConstant(result);
  result = result.replace('#{CONSTANT}', dynamicConstant);

  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'Add.js';
  return [path, fileName, result];
};

//生成详情页面
const generateDetails = param => {
  let result = fs.readFileSync(detailsTemp, 'utf8');
  const editLength = param.tableInfo.filter(editItem => editItem.editFlag === '1').length;
  const drawerWidth = editLength < 6 ? 550 : 740;
  const col = editLength < 6 ? 1 : 2;
  let detailsItems = `<DescriptionList col="${col}" size="large" style={{ marginBottom: 32,paddingBottom:20 }}>\r\n`;
  param.tableInfo.forEach(item => {
    if (item.editFlag === '1') {
      detailsItems += utils.renderDetailsItem(item, editLength);
    }
  });
  detailsItems += `</DescriptionList>`;
  //模板替换
  result = result.replace('#{DETAILSITEM}', detailsItems).replace('#{DRAWERWIDTH}', drawerWidth);
  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);

  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'Details.js';
  return [path, fileName, result];
};

//生成入口页面
const generateIndex = (param, namespace) => {
  let result = fs.readFileSync(indexTemp, 'utf8');
  //模板替换
  result = result.replace(/#{NAMESPACE}/g, namespace);
  //动态import antd 模块
  const importAd = utils.importAD(result);
  result = result.replace('#{IMPORTANTD}', importAd);
  //动态import dynamicImport 模块
  const importDyn = utils.dynamicImport(result);
  result = result.replace('#{IMPORTDYNAMIC}', importDyn);
  const path = `${pagesPath}${param.parentRouter}${param.router}`;
  const fileName = 'index.js';
  return [path, fileName, result];
};

//生成service页面
const generateService = param => {
  let result = fs.readFileSync(serverTemp, 'utf8');
  const baseReqUrl = `${param.parentRouter}${param.router}`;

  const queryListUrl =
    '`${APIPREX}' + baseReqUrl + '?size=${params.size?params.size:10}&current=${params.current}`';
  const saveUrl = '`${APIPREX}' + baseReqUrl + '/add`';
  const updateUrl = '`${APIPREX}' + baseReqUrl + '/update`';
  const getUrl = '`${APIPREX}' + baseReqUrl + '/${params.id}`';
  const delUrl = '`${APIPREX}' + baseReqUrl + '`';

  //模板替换
  result = result
    .replace('#{QUERYLISTURL}', queryListUrl)
    .replace('#{SAVEURL}', saveUrl)
    .replace('#{UPDATEURL}', updateUrl)
    .replace('#{GETURL}', getUrl)
    .replace('#{DELETEURL}', delUrl);
  const path = `${serverPath}${param.parentRouter}${param.router}`;
  const fileName = 'service.js';
  return [path, fileName, result];
};

//生成 models 页面
const generateModels = (param, namespace) => {
  let result = fs.readFileSync(modelsTemp, 'utf8');
  const importServer = `import {queryList,save,update,get,del} from '@/services${
    param.parentRouter
  }${param.router}/service';`;
  const router = `${param.parentRouter}${param.router}`;
  //模板替换
  result = result
    .replace('#{IMPORTSERVER}', importServer)
    .replace('#{ROUTER}', router)
    .replace(/#{NAMESPACE}/g, namespace);
  const path = `${pagesPath}${param.parentRouter}${param.router}/models`;
  const fileName = `${namespace}.js`;
  return [path, fileName, result];
};

//生成 router 页面
const generateRouter = param => {
  const parentRouter = param.parentRouter;
  const currentRouter = param.router;
  const fullRouter = `${parentRouter}${currentRouter}`;
  let componentPath = '';
  if (param.hasPage === '1') {
    componentPath = '.' + utils.resetPath(`pages${fullRouter}`).replace('pages', '') + 'index';
  }
  const routerName = currentRouter.substring(1, fullRouter.length).replace(/\//g, '.');

  utils.getDataFile(`${routerPath}/router.config.js`, data => {
    let router = eval(
      (data || '')
        .toString()
        .replace('export', '')
        .replace('default', '')
        .replace(';', '')
    );
    routerHelp(router);
    const fullPath = `${routerPath}/router.config.js`;
    let result = 'export default ' + JSON.stringify(eval(router));
    result = result.replace(/,/g, ',\r\n');

    utils.writer(utils.formatPath(routerPath), fullPath, result);
    //格式化代码 selint 效验
    utils.formatJsonCode(fullPath);
  });

  const routerHelp = router => {
    router.forEach(item => {
      //需要在该节点下生成子路由
      if (item.path === parentRouter) {
        item.routes = item.routes || [];
        //存在该路由是不创建
        const existRouter = item.routes.filter(item => item.path === fullRouter).length <= 0;
        if (item.routes && existRouter) {
          const componentItem = componentPath ? { component: componentPath } : {};
          item.routes.push({
            ...{
              path: fullRouter,
              name: routerName,
            },
            ...componentItem,
          });
        }
      } else if (item.routes) {
        routerHelp(item.routes);
      }
    });
  };
};

//菜单名称国际化处理
const generateLocalesMenus = param => {
  const fullRouter = `${param.parentRouter}${param.router}`;
  const routerName = fullRouter.substring(1, fullRouter.length).replace(/\//g, '.');
  param.menuName.forEach(item => {
    menuLocales.forEach(itemLocale => {
      if (item.type === itemLocale.type) {
        const fullPath = `${itemLocale.path}/menu.js`;
        utils.getDataFile(fullPath, data => {
          if (data.toString().indexOf(routerName) === -1) {
            data = data
              .toString()
              .replace('}', '')
              .replace(';', '');
            const result = `${data}'menu.${routerName}':'${item.name}',}`;
            utils.writer(utils.formatPath(itemLocale.path), fullPath, result);
            utils.formatJsonCode(fullPath);
          }
        });
      }
    });
  });
};

const myReplace = (content, replaceStr) => {
  content = content.replace(replaceStr, '');
  if (content.indexOf(replaceStr) > -1) {
    return myReplace(content, replaceStr);
  } else {
    return content;
  }
};

module.exports = {
  generateCodeHandle,
};
