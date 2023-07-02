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
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  },
  upload: {
    mode: 'file',
    fileSize: '50mb',
    whitelist: ['.xls', '.xlsx'],
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'wiring_upload_tmp'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟 (30分钟)
    cleanTimeout: 5 * 60 * 1000,
    match: /\/wiring\/upload\/excel/,
  },
} as MidwayConfig;
