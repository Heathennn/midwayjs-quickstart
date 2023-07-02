// 配置上传文件对应的功能编码
import * as fs from 'fs';
// import * as path from 'path';
import * as dayjs from 'dayjs';
import { Config, Provide } from '@midwayjs/core';

@Provide()
export class Utils {
  @Config('uploadFilePath')
  uploadFilePath;

  getExcelDir(date) {
    let day = date;
    if (!day) {
      day = dayjs().format('YYYY-MM-DD');
    }
    const filePath = `${this.uploadFilePath}/${day}/`;
    return filePath;
  }

  setExcelConfig(fileInfo) {
    const dayDir = this.getExcelDir(fileInfo.dirName);
    let config;
    const configPath = dayDir + 'config.json';
    if (!fs.existsSync(configPath)) {
      const config = {
        [fileInfo.fileCode]: `${fileInfo.fileName}`,
      };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    } else {
      config = fs.readFileSync(configPath);
      config = JSON.parse(config);
      config[fileInfo.fileCode] = fileInfo.fileName;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    }
  }
}
