import {
  Controller,
  Post,
  Body,
  Files,
  Fields,
  Config,
  Param,
  Inject,
} from '@midwayjs/core';
// import * as path from 'path';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { Utils } from '../util/common';
// import { fileProcess } from '../model/fileProcess.model';
// import { InjectEntityModel } from '@midwayjs/typeorm';
// import { Repository } from 'typeorm';
import { fileProcessDTO } from '../dto/fileProcess';
import { CommonUploadFiles } from './controller.interface';
import { Context } from '@midwayjs/koa';
import { FileService } from '../service/file.service';
import { EnumFileProcessStatus } from '../enum/fileProcess';
@Controller('/', { ignoreGlobalPrefix: true })
export class FileController {
  @Config('uploadFilePath')
  uploadFilePath: string;

  @Inject()
  ctx: Context;

  @Inject()
  Utils: Utils;

  @Inject()
  FileService: FileService;

  //   @InjectEntityModel(fileProcess)
  //   fileProcessModel: Repository<fileProcess>;

  @Post('/upload/excel/:fileCode')
  async uploadExcel(
    @Param('fileCode') fileCode: string | number,
    @Files() files: CommonUploadFiles,
    @Fields() fields: any
  ): Promise<any> {
    const dirName = fields.dateTime || dayjs().format('YYYY-MM-DD');
    const dirPath = `${this.uploadFilePath}/${dirName}`;
    this.ctx.logger.info(dirPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    // file.path = `${dirPath}/${file.name}`;
    const fileInfo = {
      dirName,
      fileCode,
      fileName: files[0].filename,
      filePath: files[0].data,
      newFilePath: `${dirPath}/${files[0].filename}`,
    };

    const reader = fs.createReadStream(fileInfo.filePath);
    const upStream = fs.createWriteStream(fileInfo.newFilePath);
    reader.pipe(upStream);
    reader.on('close', async () => {
      // 更新文件进度表
      this.ctx.logger.info(`上传成功: ${fileInfo.newFilePath}`);
      await this.FileService.updateFileProcess({
        file_code: fileInfo.fileCode,
        file_name: fileInfo.fileName,
        process_status: EnumFileProcessStatus.UPLOADED, // 上传成功
        record_time: fileInfo.dirName,
      });
      // 配置文件code对应的文件名
      this.Utils.setExcelConfig(fileInfo);
      // 可以先不处理，全部传完后主动调用处理按钮
      // 拿到所有可以入库的数据
      // let dataInfo = await parseExcel(fileInfo.fileCode, fileInfo.dirName);
      // 线损表 - 记录异常线路
      this.ctx.logger.info(
        `解析完成: ${fileInfo.dirName}-${fileInfo.fileName}`
      );
      await this.FileService.updateFileProcess({
        file_code: fileInfo.fileCode,
        record_time: fileInfo.dirName,
        process_status: EnumFileProcessStatus.SUCCESS, // 上传成功
      });
    });
    return fields;
  }

  @Post('/export/excel')
  async exportExcel(@Body() params: object): Promise<object> {
    console.log('fileCode', params);
    return params;
  }

  @Post('/wiring/file/process')
  async getFileProcess(@Body() params: fileProcessDTO): Promise<object> {
    // console.log('fileCode', params);
    let fileProcesses = await this.FileService.getCurrentFileProcess(params);
    return {
      code: 200,
      data: fileProcesses,
      msg: 'success',
    };
  }
}
