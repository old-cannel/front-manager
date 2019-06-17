export default [{
    "path": "/user",
    "component": "../layouts/UserLayout",
    "routes": [{
        "path": "/user",
        "redirect": "/user/login"
      },
      {
        "path": "/user/login",
        "name": "login",
        "component": "./User/Login"
      },
      {
        "component": "404"
      }
    ]
  },
  {
    "path": "/",
    "component": "../layouts/BasicLayout",
    "Routes": ["src/pages/Authorized"],
    "routes": [{
        "path": "/",
        "redirect": "/auto/completeList"
      },
      {
        "name": "exception",
        "icon": "warning",
        "path": "/exception",
        "hideInMenu": true,
        "routes": [{
            "path": "/exception/403",
            "name": "not-permission",
            "hideInMenu": true,
            "component": "./Exception/403"
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "hideInMenu": true,
            "component": "./Exception/404"
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "hideInMenu": true,
            "component": "./Exception/500"
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": "./Exception/TriggerException"
          }
        ]
      },
      {
        "name": "auto",
        "icon": "highlight",
        "path": "/auto",
        "routes": [{
          "path": "/auto/completeList",
          "name": "frame",
          "component": "./Auto/index"
        }]
      },
      {
        "path": "/sys",
        "name": "sys",
        "routes": [{
            "path": "/sys/api",
            "name": "api",
            "component": "./Sys/Api/index"
          },
          {
            "path": "/sys/menu",
            "name": "menu",
            "component": "./Sys/Menu/index"
          },
          {
            "path": "/sys/dict",
            "name": "dict",
            "component": "./Sys/Dict/index"
          },
          {
            "path": "/sys/role",
            "name": "role",
            "component": "./Sys/Role/index"
          },
        ]
      },
      {
        "component": "404"
      }
    ]
  }
]
