官方地址：https://github.com/ant-design/ant-design-pro

#代码生成：
    1.config/config.js  proxy 代理不要删除 /createFile 保留  
    2.代码生成会生成 index.js(页面入口)，Add.js(新增页面)，Edit.js(修改页面)，List.js(列表页面)，Filter.js(列表筛选)，  
    Details.js(详情页面)models文件,server.js文件以及自动生成路由等  
    3.需要在/src/services/api.js文件中 配置 export const API_PREX = `/api/xxx` 接口请求前缀   
    4.生成的list页面字段过多 需要在<Table  加上合适的宽度 eg:<Table style={{width:3000}}  
    

