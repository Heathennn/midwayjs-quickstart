import {
  Controller,
  Post,
  Body,
  //   Files,
  //   Fields,
  Config,
  //   Param,
  Inject,
} from '@midwayjs/core';
// import * as path from 'path';
// import * as fs from 'fs';
// import * as dayjs from 'dayjs';
import { Utils } from '../util/common';
import { fileProcess } from '../model/fileProcess.model';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { userRecordDTO } from '../dto/wiring';
import { WiringService } from '../service/wiring.service';
@Controller('/')
export class WiringController {
  @Config('uploadFilePath')
  uploadFilePath: string;

  @Inject()
  Utils: Utils;

  @Inject()
  WiringService: WiringService;

  @InjectEntityModel(fileProcess)
  fileProcessModel: Repository<fileProcess>;

  @Post('/user/record')
  async getUserRecord(@Body() params: userRecordDTO): Promise<object> {
    console.log('params', params);
    const [records, total] = await this.WiringService.getUserRecord(params);
    return {
      rows: records,
      total,
    };
  }

  //   @Post('/file/process')
  //   async getFileProcess(@Body() params: fileProcessDTO): Promise<object> {
  //     console.log('fileCode', params);
  //     let fileProcesses = await this.fileProcessModel.findAndCount({});
  //     return fileProcesses;
  //   }
}
