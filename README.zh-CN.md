# my_midway_project

## QuickStart

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.


### 目录结构
```bash
.
├── dist //打包后的文件, 通常pm2运行的是这个文件夹下的代码, 但也依赖node_modules
│   ├── config
│   ├── controller
│   ├── filter
│   ├── middleware
│   └── service
├── logs // 日志文件, 部署上线后建议不要打日志到项目文件夹内, 应该打在一个专门存放日志的目录下
│   └── my-midway-project
├── src
│   ├── config // 配置: 全局配置如端口号, 组件配置如typeorm/upload等
│   ├── controller // 路由极其映射的方法
│   ├── dto // dto:数据传输对象, 用来校验和格式化参数
│   ├── filter// 全局filter, 是一个中间件的用法, 如捕捉404,捕捉校验参数时抛出的错误
│   ├── middleware // 中间件 实现一个全局或局部的功能, 如日志打印
│   ├── model // 数据模型,用来链接数据库+表+字段定义
│   ├── service // 从controller抽离出来的业务逻辑, 一般用来复用给各个controller
│   └── util// 工具类
├── test
│   └── controller
└── uploads // 本地开发时配置的上传文件路径
    └── 2023-06-27

-----------------------------------------
.
├── dist  //打包后的文件, 通常pm2运行的是这个文件夹下的代码, 但也依赖node_modules
│   ├── config
│   ├── controller
│   ├── filter
│   ├── middleware
│   └── service
├── logs // 日志文件, 部署上线后建议不要打日志到项目文件夹内, 应该打在一个专门存放日志的目录下
│   └── my-midway-project
├── src
│   ├── aspect // 拦截器 拦截器可以拦截controller, 此处用来修改response的结构
│   ├── config // 配置: 全局配置+组件配置 如端口号, 全局路由前缀等 组件配置如typeorm/upload等
│   ├── controller // 路由+映射的方法
│   ├── dto // 数据传输对象, 用来校验和格式化参数
│   ├── enum // 枚举类
│   ├── error // 自定义error信息, 可以直接抛出
│   ├── filter // 全局filter, 用来处理异常, 因为他在中间件之后被执行, 如捕捉404,捕捉校验参数时抛出的错误
│   ├── middleware // 中间件 可以处理进入controller之后或respons之后的操作, 此处report用作记录请求前的时间以及打印response之后的时间间隔
│   ├── model // 数据库实体 定义表结构 关联关系
│   ├── service // 从controller里抽离出来的公共服务 
│   └── util // 通用工具类 @Provide 使用时像service一样 @Inject
└── test
    └── controller
```

### 功能
- [x] 基础目录结构
- [x] 基本接口功能(POST)
- [x] 文件上传接口controller/FileController及配置config/*
- [x] 全局多环境配置config/*
- [x] 参数校验(joi) dto/*
- [x] 全局中间件 report 接口请求信息打印
- [x] 全局filter: 参数错误拦截/错误请求地址拦截/其他错误处理
- [x] 自定义错误类型 error/* 自定义抛出登录异常错误userController
- [x] typeORM(mysql)基本功能及全局配置 model/* config/*
- [x] 增/删/改/查/左联/分页(Query Builder)
- [x] 公共服务抽离及使用 service/*
- [x] ctx.logger
- [x] cors跨域配置

