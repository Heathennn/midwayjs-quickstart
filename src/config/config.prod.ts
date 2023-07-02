import { MidwayConfig } from '@midwayjs/core';
// import { uploadWhiteList } from '@midwayjs/upload';
import { tmpdir } from 'os';
import { join } from 'path';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1687246629002_518',
  koa: {
    port: 7007,
    globalPrefix: '/wiring', // 全局路由前缀
  },
  midwayLogger: {
    default: {
      dir: '/home/logs', // 日志输出目录
    },
  },
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  },
  upload: {
    mode: 'file',
    fileSize: '50mb',
    whitelist: ['.xls', '.xlsx'],
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'wiring_prod_upload_tmp'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟 (30分钟)
    cleanTimeout: 5 * 60 * 1000,
    match: /\/upload\/excel/,
  },
  uploadFilePath: join(__dirname, '/home/uploads/'),
  typeorm: {
    dataSource: {
      default: {
        /**
         * 单数据库实例
         */
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'wiring_midway_prod',
        synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: false,
        // 配置实体模型
        // entities: [Config],

        // 或者扫描形式
        entities: ['**/model/*.model{.ts,.js}'],
      },
    },
  },
} as MidwayConfig;
