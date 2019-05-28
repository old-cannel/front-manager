const fs = require('fs');
const exec = require('child_process').exec;
/**
 * 检查路径是否存在 如果不存在则创建路径
 * @param {string} folderpath 文件路径
 */
const checkDirExist = folderpath => {
  const pathArr = folderpath.split('/');
  let _path = '';
  let upperCase = false;
  for (let i = 0; i < pathArr.length; i++) {
    if ('.' !== pathArr[i]) {
      if (pathArr[i]) {
        let urlTemp = pathArr[i];
        if (upperCase) {
          urlTemp =
            urlTemp.substring(0, 1).toLocaleUpperCase() + urlTemp.substring(1, urlTemp.length);
        }
        _path += `/${urlTemp}`;
        let pathTemp = '.' + _path;
        if (pathArr[i] === 'pages') {
          upperCase = true;
        }
        if (!fs.existsSync(pathTemp)) {
          fs.mkdirSync(pathTemp);
        }
      }
    }
  }
};

/**
 * 写入文件
 * @param path 路径
 * @param fileName 文件名称
 * @param result 写入内容
 */
const writer = (paths, fullPath, result) => {
  //创建目录
  paths.forEach(item => {
    if (!fs.existsSync(item)) {
      fs.mkdirSync(item);
    }
  });
  //写入内容
  fs.writeFile(fullPath, result, 'utf8', function(error) {
    if (error) {
      console.log('\033[41;0m  创建文件成功：' + error + '\033[0m');
      return false;
    }
    console.log('\033[42;0m  创建文件成功：' + fullPath + '\033[0m');
  });
};

/**
 * 代码格式化
 * @param command 命令
 */
const formatCode = command => {
  const execCommand = `eslint --fix ${command}`;
  exec(execCommand, function(err, stdout, stderr) {
    if (err) {
      console.log('\033[41;0m  格式化代码失败：' + err + '\033[0m');
    } else {
      console.log('\033[42;0m  格式化代码完成：' + execCommand + '\033[0m');
    }
  });
};

/**
 * 代码格式化 Json 代码
 * @param command 命令
 */
const formatJsonCode = path => {
  const execCommand = `js-beautify -s 2 -f  ${path} -r ${path}`;
  exec(execCommand, function(err, stdout, stderr) {
    if (err) {
      console.log('\033[41;0m  格式化代码完成：' + execCommand + '\033[0m');
    } else {
      console.log('\033[42;0m  格式化代码完成：' + execCommand + '\033[0m');
    }
  });
};

/**
 * 根据生成的code 动态引入需要加载的ant design 代码
 * @param content 生成的代码
 */
const importAD = content => {
  let modules = [];
  //input
  if (content.indexOf('<Input') > -1) {
    modules.push('Input');
  }
  //select
  if (content.indexOf('<Select') > -1) {
    modules.push('Select');
  }
  //Modal
  if (content.indexOf('<Modal') > -1) {
    modules.push('Modal');
  }
  //Modal
  if (content.indexOf('confirm({') > -1) {
    modules.push('Modal');
  }

  //select
  if (content.indexOf('<Select') > -1) {
    modules.push('Select');
  }

  //InputNumber
  if (content.indexOf('<InputNumber') > -1) {
    modules.push('InputNumber');
  }

  //Row
  if (content.indexOf('<Row') > -1) {
    modules.push('Row');
  }

  //Col
  if (content.indexOf('<Col') > -1) {
    modules.push('Col');
  }

  //Form
  if (content.indexOf('<Form') > -1) {
    modules.push('Form');
  }

  //DatePicker
  if (content.indexOf('<RangePicker') > -1 || content.indexOf('<DatePicker') > -1) {
    modules.push('DatePicker');
  }

  //Button
  if (content.indexOf('<Button') > -1) {
    modules.push('Button');
  }

  //Drawer
  if (content.indexOf('<Drawer') > -1) {
    modules.push('Drawer');
  }
  //Drawer
  if (content.indexOf('<Divider') > -1) {
    modules.push('Divider');
  }

  //Popconfirm
  if (content.indexOf('<Popconfirm') > -1) {
    modules.push('Popconfirm');
  }

  //Table
  if (content.indexOf('<Table') > -1) {
    modules.push('Table');
  }
  //Table
  if (content.indexOf('<Spin') > -1) {
    modules.push('Spin');
  }
  //Table
  if (content.indexOf('message.') > -1) {
    modules.push('message');
  }

  if (modules.length > 0) {
    modules = new Set(modules);
    let importAD = '';
    modules.forEach(item => {
      importAD += item + ',';
    });

    return `import { ${importAD} } from 'antd';`;
  }
  return '';
};

//动态引入import
const dynamicImport = content => {
  let importDyn = '';
  if (content.indexOf('DatePicker') > -1) {
    importDyn += `import moment from 'moment';\r\n`;
  }
  if (content.indexOf('DictLabel') > -1) {
    importDyn += `import DictLabel from '@/components/Dict/DictLabel';\r\n`;
  }
  return importDyn;
};
//动态常量
const dynamicConstant = content => {
  let dynamicConstant = '';
  if (content.indexOf('MonthPicker') > -1) {
    dynamicConstant += `const { MonthPicker  } = DatePicker;\r\n`;
  }
  if (content.indexOf('<FormItem') > -1) {
    dynamicConstant += `const FormItem = Form.Item;\r\n`;
  }
  if (content.indexOf('<RangePicker') > -1) {
    dynamicConstant += `const { RangePicker } = DatePicker;\r\n`;
  }
  if (content.indexOf('<Option') > -1) {
    dynamicConstant += `const  { Option }  =Select;\r\n`;
  }
  if (content.indexOf('confirm({') > -1) {
    dynamicConstant += `const  { confirm }  =Modal;\r\n`;
  }
  return dynamicConstant;
};

/**
 * 生成需要判断的路径格式
 */
const formatPath = path => {
  const paths = path.split('/');
  const formatPath = [];
  (paths || []).forEach((item, index) => {
    if (index === 0) {
      formatPath.push(`${item}/`);
    } else {
      formatPath.push(`${formatPath[formatPath.length - 1]}${item}/`);
    }
  });
  return formatPath;
};

/**
 * 编辑页面 表单
 * @param item
 */
const renderEditFormItem = (item, editLength) => {
  const notNullFlag = item.notNullFlag === '1';
  const checkLength = item.columnLength && item.columnLength !== '';
  const length = item.columnLength;
  const message = `${item.columnName}不能为空`;
  let formItem = '';
  let dataHandle = '';

  let colTemp = `<Col span="12">`;
  if (editLength < 6) {
    colTemp = `<Col span="24">`;
  }
  const componentType = item.component.type;
  switch (componentType) {
    case 'Input':
      const lengthStr = checkLength ? `maxLength={${length}}` : '';
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName},
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<Input ${lengthStr} style={{ maxWidth: 200 }} placeholder='请输入${
        item.columnName
      }'/>)}
         </FormItem>
      </Col>\r\n`;
      break;
    case 'DatePicker_date':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName}? moment(current.${
        item.javaName
      }, 'YYYY-MM-DD') : '',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker format="YYYY-MM-DD" style={{ width: 200 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD');
          }\r\n`;
      break;
    case 'DatePicker_datetime':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName}? moment(current.${
        item.javaName
      }, 'YYYY-MM-DD HH:mm:ss') : '',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 200 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD HH:mm:ss');
          }\r\n`;
      break;
    case 'Select':
      if (item.component.dataFrom === '1') {
        let optionStr = "<Option value=''>请选择</Option> \r\n";
        (item.component.dataSource || []).forEach(item => {
          optionStr += ` <Option value="${item.value}">${item.label}</Option> \r\n`;
        });
        formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
               initialValue:current.${item.javaName}?current.${item.javaName}:'',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(
             <Select defaultValue='' style={{ maxWidth: 200 }} placeholder='请选择${
               item.columnName
             }'>
              ${optionStr}
          </Select>)}
         </FormItem>
      </Col>\r\n`;
      } else if (item.component.dataFrom === '2') {
        formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
              initialValue:current.${item.javaName}?current.${item.javaName}:'',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(
             <Select defaultValue='' style={{ maxWidth: 200 }} placeholder='请选择${
               item.columnName
             }'>
              <Option value=''>请选择</Option>
              {
               (this.props.dictInfo || []).filter(filterItem=>filterItem.type==='${
                 item.component.column
               }').map(item=>{
              return  <Option key={item.value} value={item.value}>{item.label}</Option>
            })
            }
          </Select>)}
         </FormItem>
      </Col>\r\n`;
      }
      break;
    case 'InputNumber':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName},
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<InputNumber min={0} max={9999999}  precision="0" style={{ maxWidth: 200 }} placeholder='请输入${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      break;
    default:
      break;
  }
  return [formItem, dataHandle];
};

/**
 * 新增页面 表单
 * @param item
 */
const renderAddFormItem = (item, editLength) => {
  const notNullFlag = item.notNullFlag === '1';
  const checkLength = item.columnLength && item.columnLength !== '';
  const length = item.columnLength;
  const message = `${item.columnName}不能为空`;
  let formItem = '';
  let dataHandle = '';

  let colTemp = `<Col span="12">`;
  if (editLength < 6) {
    colTemp = `<Col span="24">`;
  }
  const componentType = item.component.type;
  switch (componentType) {
    case 'Input':
      const lengthStr = checkLength ? `maxLength={${length}}` : '';
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<Input ${lengthStr} style={{ maxWidth: 200 }} placeholder='请输入${
        item.columnName
      }'/>)}
         </FormItem>
      </Col>\r\n`;
      break;
    case 'DatePicker_date':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}',{
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker format="YYYY-MM-DD" style={{ width: 200 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD');
          }\r\n`;
      break;
    case 'DatePicker_datetime':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 200 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD HH:mm:ss');
          }\r\n`;
      break;
    case 'Select':
      if (item.component.dataFrom === '1') {
        let optionStr = "<Option value=''>请选择</Option> \r\n";
        (item.component.dataSource || []).forEach(item => {
          optionStr += ` <Option value="${item.value}">${item.label}</Option> \r\n`;
        });
        formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
             initialValue:'',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(
             <Select defaultValue='' style={{ maxWidth: 200 }} placeholder='请选择${
               item.columnName
             }'>
              ${optionStr}
          </Select>)}
         </FormItem>
      </Col>\r\n`;
      } else if (item.component.dataFrom === '2') {
        formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
             initialValue:'',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(
             <Select defaultValue='' style={{ maxWidth: 200 }} placeholder='请选择${
               item.columnName
             }'>
              <Option value=''>请选择</Option>
              {
               (this.props.dictInfo || []).filter(filterItem=>filterItem.type==='${
                 item.component.column
               }').map(item=>{
              return  <Option key={item.value} value={item.value}>{item.label}</Option>
            })
            }
          </Select>)}
         </FormItem>
      </Col>\r\n`;
      }
      break;
    case 'InputNumber':
      formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<InputNumber  min={0} max={9999999}  precision="0" style={{ maxWidth: 200 }} placeholder='请输入${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
      break;
    default:
      break;
  }
  return [formItem, dataHandle];
};

/**
 * 生成详情页面item
 * @param item
 * @param editLength
 * @returns {string}
 */
const renderDetailsItem = (item, editLength) => {
  let colTemp = `<Col span={12}>`;
  if (editLength < 6) {
    colTemp = `<Col span="24">`;
  }
  let str = `current.${item.javaName}`;
  if (item.component.type === 'Select') {
    if (item.component.dataFrom === '2') {
      str = `<DictLabel type={"${item.component.column}"} value={current.${item.javaName}}/>`;
    } else if (item.component.dataFrom === '1') {
      str = `<DictLabel source={${JSON.stringify(item.component.dataSource)}} value={current.${
        item.javaName
      }}/>`;
    }
  }
  const detailsItems = `<Description term="${item.columnName}">{${str}}</Description>\r\n`;

  return detailsItems;
};

/**
 * 筛选 表单
 * @param item
 */
const renderFilterFormItem = (item, editLength) => {
  const notNullFlag = item.notNullFlag === '1';
  const checkLength = item.columnLength && item.columnLength !== '';
  const length = item.columnLength;
  const message = `${item.columnName}不能为空`;
  let formItem = '';
  let dataHandle = '';
  const componentType = item.component.type;
  switch (componentType) {
    case 'Input':
      formItem = `
         <FilterItem label="${item.columnName}:" >
            {getFieldDecorator('${item.javaName}', {
             })(<Input  style={{ width: 200 }} placeholder='请输入${item.columnName}'/>)}
         </FilterItem>\r\n`;
      break;
    case 'DatePicker_date':
      formItem = `
        <FilterItem type="rangePicker" label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                })(<RangePicker  format="YYYY-MM-DD HH:mm:ss" showTime />)}
        </FilterItem>\r\n`;
      dataHandle += `     if (searchParam.${item.javaName} && searchParam.${
        item.javaName
      }.length===2) {
        searchParam.${item.javaName}Search=[]
        searchParam.${item.javaName}Search[0] = moment(searchParam.${
        item.javaName
      }[0]).format('YYYY-MM-DD');
        searchParam.${item.javaName}Search[1] = moment(searchParam.${
        item.javaName
      }[1]).format('YYYY-MM-DD');
        searchParam.${item.javaName}=''
      }\r\n`;
      break;
    case 'DatePicker_datetime':
      formItem = `
         <FilterItem type="rangePicker" label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                })(<RangePicker  format="YYYY-MM-DD HH:mm:ss" showTime  />)}
         </FilterItem>\r\n`;
      dataHandle += `if (searchParam.${item.javaName} && searchParam.${item.javaName}.length===2) {
        searchParam.${item.javaName}Search=[]
        searchParam.${item.javaName}Search[0] = moment(searchParam.${
        item.javaName
      }[0]).format('YYYY-MM-DD HH:mm:ss');
        searchParam.${item.javaName}Search[1] = moment(searchParam.${
        item.javaName
      }[1]).format('YYYY-MM-DD HH:mm:ss');
        searchParam.${item.javaName}=''
      }\r\n`;
      break;
    case 'Select':
      if (item.component.dataFrom === '1') {
        let optionStr = "<Option value=''>全部</Option> \r\n";
        (item.component.dataSource || []).forEach(item => {
          optionStr += ` <Option value="${item.value}">${item.label}</Option> \r\n`;
        });
        formItem = `
         <FilterItem label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                    initialValue:''
                })(
                 <Select defaultValue=''  style={{ width: 200 }} >
              ${optionStr}
          </Select>)}
         </FilterItem>\r\n`;
      } else if (item.component.dataFrom === '2') {
        formItem = `
         <FilterItem label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                    initialValue:''
                })( 
                <Select defaultValue='' style={{ width: 200 }}>
                <Option value=''>全部</Option>
            {
               (this.props.dictInfo || []).filter(filterItem=>filterItem.type==='${
                 item.component.column
               }').map(item=>{
              return  <Option key={item.value} value={item.value}>{item.label}</Option>
            })
            }
          </Select>)}
         </FilterItem>\r\n`;
      }
      break;
    case 'InputNumber':
      formItem = `
         <FilterItem label="${item.columnName}:" >
            {getFieldDecorator('${item.javaName}', {
             })(<InputNumber min={0} max={9999999}  precision="0" style={{ width: 200 }} placeholder='请输入${
               item.columnName
             }'/>)}
         </FilterItem>\r\n`;
      break;
  }
  return [formItem, dataHandle];
};

/**
 * 路径生成效验（大小写问题）
 */
const resetPath = paths => {
  let path = '';
  if (paths.split('/').length > 0) {
    //pages 下面的路径需要大写
    let upperCase = false;
    paths.split('/').forEach(item => {
      if (upperCase) {
        item = item.substring(0, 1).toLocaleUpperCase() + item.substring(1, item.length);
      }
      if (item === 'pages') {
        upperCase = true;
      }
      path += `${item}/`;
    });
  }
  return path;
};

const getDataFile = (path, callBack) => {
  fs.readFile(path, function(err, data) {
    if (err) {
      console.log(err);
    }
    callBack(data);
  });
};

module.exports = {
  writer,
  formatCode,
  importAD,
  formatPath,
  resetPath,
  dynamicImport,
  renderEditFormItem,
  dynamicConstant,
  renderFilterFormItem,
  renderDetailsItem,
  getDataFile,
  renderAddFormItem,
  formatJsonCode,
};
