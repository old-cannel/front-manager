const http = require('http');
const url = require('url');
const generate = require('./modules/index.js');

const data = {
  id: '1',
  router: [],
  tableName: 'sys_test',
  tableComment: '用户基表',
  fileUrl: '/sys/user',
  parentRouter: '/sys',
  router: '/test',
  hasPage: '1',
  menuName: [
    {
      type: 'zh-CN',
      name: '用户管理',
    },
    {
      type: 'en-US',
      name: 'userManager',
    },
  ],
  tableInfo: [
    {
      id: '1',
      tableId: '1',
      column: 'id',
      columnName: 'id',
      columnType: 'char(32)',
      javaType: 'String',
      javaName: 'id',
      primaryFlag: '1',
      notNullFlag: '0',
      insetFlag: '0',
      editFlag: '0',
      listFlag: '0',
      queryFlag: '0',
      sort: '10',
    },
    {
      id: '2',
      tableId: '1',
      column: 'code',
      columnName: '编码',
      columnType: 'varchar(64)',
      javaType: 'String',
      javaName: 'code',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
    {
      id: '4',
      tableId: '1',
      column: 'name',
      columnName: '用户名',
      columnType: 'varchar(50)',
      javaType: 'String',
      javaName: 'name',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
    {
      id: '11',
      tableId: '1',
      column: 'add_time',
      columnName: '创建时间',
      columnType: 'datetime',
      javaType: 'Date',
      javaName: 'addTime',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'DatePicker_datetime',
      },
    },
    {
      id: '11',
      tableId: '1',
      column: 'upd_time',
      columnName: '修改时间',
      columnType: 'date',
      javaType: 'Date',
      javaName: 'updTime',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'DatePicker_datetime',
      },
    },
    {
      id: '12',
      tableId: '1',
      column: 'add_user_code',
      columnName: '创建者',
      columnType: 'varchar(64)',
      javaType: 'String',
      javaName: 'addUserCode',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
    {
      id: '13',
      tableId: '1',
      column: 'add_mark',
      columnName: '新增备注',
      columnType: 'varchar(250)',
      javaType: 'String',
      javaName: 'addMark',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
    {
      id: '15',
      tableId: '1',
      column: 'upd_user_code',
      columnName: '更新者',
      columnType: 'varchar(64)',
      javaType: 'String',
      javaName: 'updUserCode',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
    {
      id: '16',
      tableId: '1',
      column: 'upd_mark',
      columnName: '更新备注',
      columnType: 'varchar(250)',
      javaType: 'String',
      javaName: 'updMark',
      primaryFlag: '1',
      notNullFlag: '1',
      insetFlag: '1',
      editFlag: '1',
      listFlag: '1',
      queryFlag: '1',
      sort: '10',
      component: {
        type: 'Input',
      },
    },
  ],
};

http
  .createServer(function(request, response) {
    try {
      const pathName = url.parse(request.url).pathname;
      if (pathName === '/createFile') {
        //generate.generateCodeHandle(data);

        let data = '';
        request.on('data', chunk => {
          data += chunk;
          generate.generateCodeHandle(JSON.parse(data));
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write('successful');
          response.end();
        });
      }
    } catch (e) {
      console.log(e);
    }
  })
  .listen(9229);

// chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/6d9718e6-f366-4675-aff0-826def458b08
