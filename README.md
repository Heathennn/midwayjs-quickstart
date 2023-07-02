# midwayjs-template

## 文档
1. [Midway](http://www.midwayjs.org/docs/intro)
2. [typeORM](https://typeorm.biunav.com/zh/)
3. [pm2](https://pm2.io/docs/runtime/overview/)
4. [mysql](https://www.runoob.com/mysql/mysql-tutorial.html)
### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.


### 目录结构
```bash
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
└── test 单元测试
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


### 部署
部署前需要先在服务器上配置好环境
1. node环境
2. mysql环境
3. 数据库/建表/初始化数据
4. pm2全局安装
5. pm2.json 主要是建好日志文件存放目录
6. nginx配置 端口转发/路径转发/文件系统 如有文件上传功能的话注意配置超时时间, 传输文件大小限制等参数
7. 对应的web项目请求baseUrl

完成以上配置后, 可以把node项目上传至服务器, 并运行
```
npm run build // 打包
npm run start:pm2 // 在服务器上运行此命令
```
