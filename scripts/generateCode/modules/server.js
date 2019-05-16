const process = require('process');
const cutLine = `\r\n`;

const generateService = param => {
  const tableName = param.tableName;
  let codeLines = [];
  //begin import
  codeLines.push("import request from '@/utils/request';" + cutLine);
  codeLines.push("import Api from '@services/api';" + cutLine + cutLine);
  //end import

  //request list
  codeLines.push('export async function queryList(params) {\r\n');
  codeLines.push(
    `  const url = Api.${tableName}.queryList+` +
      '`?size=${params.size}&current=${params.current}&limit=${params.limit ? params.limit:10}`;' +
      cutLine
  );
  codeLines.push("  return request(url, { method: 'POST', body: params});" + cutLine);
  codeLines.push('}' + cutLine);
  //request list end

  let str = '';
  codeLines.forEach(item => {
    str += item;
  });
  const path = `../../src/services/${tableName}/${tableName}.js`;
  debugger;
  return [path, str];
};

module.exports = {
  generateService,
};
