官方地址：https://github.com/ant-design/ant-design-pro

代码生成：
    1.代码生成需要启动命令： node --inspect ./scripts/generateCode/generateCodeService.js
      该命令已经放入start 脚本中，可以直接启动start
    2.代码生成会生成 index.js(页面入口)，Add.js(新增页面)，Edit.js(修改页面)，List.js(列表页面)，Details.js(详情页面)
      models文件,server.js文件以及自动生成路由等。  
    3.需要在/src/services/api.js文件中 配置 export const API_PREX = `/api/xxx` 接口请求前缀 
    4.确保global.less 有如下样式
      :global {
        .antd-pro-components-page-header-wrapper-index-children-content {
          margin: 24px 24px 0;
          min-width: 1280px !important;
          overflow-x: auto !important;
        }
      }
      
      .container {
        white-space: nowrap;
        display: inline-block;
        background-color: white;
        padding: 10px;
        width: 100%;
      }
      
      .drawerFooter {
        margin-top: 20px;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #e9e9e9;
        padding: 10px 16px;
        background: #ffffff;
        text-align: right;
      }

