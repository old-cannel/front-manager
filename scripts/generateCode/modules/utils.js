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
      console.log(error);
      return false;
    }
    console.log('创建文件成功：' + fullPath);
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
      console.log('格式化代码失败：' + execCommand);
    } else {
      console.log('格式化代码完成：' + execCommand);
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
  //input  输入框
  if (item.component.type === 'input') {
    formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName},
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<Input ${
               checkLength ? (maxLength = { length }) : ''
             } style={{ maxWidth: 220 }} placeholder='请输入${item.columnName}'/>)}
         </FormItem>
      </Col>\r\n`;
  } else if (item.component.type === 'DatePicker_date') {
    formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName}? moment(current.${
      item.javaName
    }, 'YYYY-MM-DD') : '',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker format="YYYY-MM-DD" style={{ width: 220 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
    dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD');
          }\r\n`;
  } else if (item.component.type === 'DatePicker_datetime') {
    formItem = `${colTemp}
         <FormItem label="${item.columnName}:" {...formItemLayout}>
            {getFieldDecorator('${item.javaName}', {
                initialValue:current.${item.javaName}? moment(current.${
      item.javaName
    }, 'YYYY-MM-DD HH:mm:ss') : '',
                   rules:[
                      ${notNullFlag ? JSON.stringify({ required: true, message: message }) : ''}
                   ]
             })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 220 }} placeholder='请选择${
               item.columnName
             }'/>)}
         </FormItem>
      </Col>\r\n`;
    dataHandle += ` if (data.${item.javaName}) {
            data.${item.javaName} = moment(data.${item.javaName}).format('YYYY-MM-DD HH:mm:ss');
          }\r\n`;
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
  const detailsItems = `<Description term="${item.columnName}">{current.${
    item.javaName
  }}</Description>\r\n`;
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

  //input  输入框
  if (item.component.type === 'input') {
    formItem = `<Col xxl={{ span: 7 }} md={{ span: 7 }}>
         <FilterItem label="${item.columnName}:" >
            {getFieldDecorator('${item.javaName}', {
             })(<Input  style={{ maxWidth: 240 }} placeholder='请输入${item.columnName}'/>)}
         </FilterItem>
      </Col>\r\n`;
  } else if (item.component.type === 'DatePicker_date') {
    formItem = `<Col xxl={{ span: 9 }} md={{ span: 9 }}>
        <FilterItem label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                })(<RangePicker  format="YYYY-MM-DD HH:mm:ss" showTime style={{ maxWidth: 350 }} />)}
        </FilterItem>
      </Col>\r\n`;
    dataHandle += ` if (searchParam.${item.javaName} && searchParam.${item.javaName}.length===2) {
        searchParam.${item.javaName}Search=[]
        searchParam.${item.javaName}Search[0] = moment(searchParam.${
      item.javaName
    }[0]).format('YYYY-MM-DD');
        searchParam.${item.javaName}Search[1] = moment(searchParam.${
      item.javaName
    }[1]).format('YYYY-MM-DD');
        searchParam.${item.javaName}=''
      }\r\n`;
  } else if (item.component.type === 'DatePicker_datetime') {
    formItem = `<Col xxl={{ span: 9 }} md={{ span: 9 }}>
         <FilterItem label="${item.columnName}:">
                {getFieldDecorator('${item.javaName}', {
                })(<RangePicker  format="YYYY-MM-DD HH:mm:ss" showTime style={{ maxWidth: 350 }} />)}
         </FilterItem>
      </Col>\r\n`;
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
};
