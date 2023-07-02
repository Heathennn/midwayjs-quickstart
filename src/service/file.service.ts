import { Config, Inject, Provide } from '@midwayjs/core';
// import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';
// import * as xlsx from 'node-xlsx';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserRecord } from '../model/userRecord.model';
import { wiringRecord } from '../model/wiringRecord.model';
import { fileProcess } from '../model/fileProcess.model';
import { fileProcessDTO } from '../dto/fileProcess';
@Provide()
export class FileService {
  @Config('uploadFilePath')
  uploadFilePath: string;

  @Inject()
  ctx: Context;

  @InjectEntityModel(UserRecord)
  userRecordModel: Repository<UserRecord>;

  @InjectEntityModel(wiringRecord)
  wiringRecordModel: Repository<wiringRecord>;

  @InjectEntityModel(fileProcess)
  fileProcessModel: Repository<fileProcess>;

  // 获取当前文件处理进度
  async getCurrentFileProcess(params: fileProcessDTO) {
    let process = this.fileProcessModel
      .createQueryBuilder('fileProcess')
      .where(
        `file_code = :file_code AND fileProcess.record_time = :record_time`,
        {
          file_code: params.file_code,
          record_time: params.record_time,
        }
      )
      .getOne();
    return process;
  }

  // 新增上传记录
  async addFileProcess(params: object) {
    await this.fileProcessModel
      .createQueryBuilder()
      .insert()
      .into(fileProcess)
      .values({
        ...params,
      })
      .execute();
    return 'ok';
  }
  // 更新文件上传记录
  async updateFileProcess(params) {
    let fileProcess = await this.fileProcessModel
      .createQueryBuilder('fileProcess')
      .where(`file_code = :file_code AND record_time = :record_time`, {
        file_code: params.file_code,
        record_time: params.record_time,
      })
      .getOne();
    if (fileProcess) {
      let updateItem = {
        ...fileProcess,
        process_status: params.process_status,
        file_code: params.file_code,
      };
      await this.fileProcessModel
        .createQueryBuilder()
        .update(fileProcess)
        .set(updateItem)
        .where(`process_id = :process_id`, {
          process_id: fileProcess.process_id,
        })
        .execute();
    } else {
      this.addFileProcess(params);
    }
  }
  /**
   * 获取到excel的存放目录前缀, 以日期区分
   * @param date 上传日期yyyy-MM-DD
   */
  async getExcelPrefixPath(date: string) {
    let day = date;
    if (!day) {
      day = dayjs().format('YYYY-MM-DD');
    }
    return path.join(`${this.uploadFilePath}/${day}/`);
  }

  /**
   * 处理原始excel, 读取出有用的数据
   * @param dataStartIndex 数据从index开始 data为包含了表头的数组 index是为了去除表头
   * @param fileCode 文件code, 上传时为了标识每个文件的用途
   * @param fileDate 文件记录日期
   * @param options 额外配置 onlyFilePath 是否只返回文件路径是则不去读文件
   */
  //   async parseRawExcel(dataStartIndex = 1, fileCode, fileDate, options = {}) {
  //     // 获取到文件路径前缀
  //     const filePathPrefix = await this.getExcelPrefixPath(fileDate);
  //     // 获取当前日期下的配置文件
  //     const configPath = filePathPrefix + 'config.json';
  //     let config = fs.readFileSync(configPath, 'utf-8');
  //     config = JSON.parse(config);
  //     // 获取到当前要处理的excel
  //     const filePath = filePathPrefix + config[fileCode];
  //     if (options.onlyFilePath) {
  //       return filePath;
  //     }
  //     const sheets = xlsx.parse(filePath);
  //     this.ctx.logger.info(`${config[fileCode]}已被xlsx解析`);
  //     // 获取所有数据集
  //     const dataList = sheets[0].data.slice(dataStartIndex);
  //     return dataList;
  //   }

  /**
   * 获取列号的索引值, 用于获取对应的值
   * @param colCode
   */
  getSheetColumnIndex(colCode: string) {
    const codeList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const xlsxColumnIndex = {
      AF: codeList.length + codeList.indexOf('F'),
      AL: codeList.length + codeList.indexOf('L'),
      AM: codeList.length + codeList.indexOf('M'),
      AG: codeList.length + codeList.indexOf('G'),
      BM: codeList.length * 2 + codeList.indexOf('M'),
      BN: codeList.length * 2 + codeList.indexOf('N'),
    };
    codeList.forEach((code, index) => {
      xlsxColumnIndex[code] = index;
    });
    return xlsxColumnIndex[colCode];
  }
  /**
   * 通过一组自定义的map结构, 把数据组装起来
   * @param effectiveData excel里的有效数据(去除表头后的)
   * @param tableMap 自定义的 [excel列]: 值
   */
  genEffectiveData(effectiveData: [], tableMap: object) {
    const tableKeys = Object.keys(tableMap);
    return effectiveData.map(record => {
      const obj = {};
      tableKeys.forEach(colCode => {
        const colIndex = this.getSheetColumnIndex(colCode);
        // obj[key] = value
        obj[tableMap[colCode]] = record[colIndex] || '';
      });
      return obj;
    });
  }

  // 数值取中位数
  getMiddleValue(valueList: number[]) {
    valueList.sort(); //排序
    valueList = valueList.map(item => +item);
    if (valueList.length % 2 === 0) {
      //判断数字个数是奇数还是偶数
      return (
        (valueList[valueList.length / 2] +
          valueList[valueList.length / 2 - 1]) /
        2
      ); //偶数个取中间两个数的平均数
    } else {
      //   return valueList[parseInt(valueList.length / 2)]; //奇数个取最中间那个数
    }
  }

  /**
   * 解析线损表 业务1
   * @param fileCode
   * @param fileDate
   */
  //   async parseExcel1(fileCode, fileDate) {
  //     this.ctx.logger.info('开始解析: [配电线路同期日线损表]');
  //     // 解析出excel里的数据
  //     const excelDataList = await this.parseRawExcel(3, fileCode, fileDate);
  //     // 处理excel数据, 拿到可以入库的数据
  //     let newWiringList = this.genEffectiveData(excelDataList, Excel1Map);
  //     // 组装数据, 插入记录时间
  //     newWiringList = newWiringList.map(item => {
  //       return {
  //         ...item,
  //         record_time: fileDate,
  //       };
  //     });
  //     // 判断是否需要判断N值, 需要的话, 小于N的线路为正常, 否则为异常+入库
  //     // 不需要的话, 全部入库
  //     let isNeedCheckNValue = false;
  //     const day15 = dayjs(fileDate).subtract(15, 'day').format('YYYY-MM-DD');
  //     const day16 = dayjs(fileDate).subtract(16, 'day').format('YYYY-MM-DD');
  //     const day1 = dayjs(fileDate).subtract(1, 'day').format('YYYY-MM-DD');
  //     const lastRecords = await this.wiringRecordModel.find({
  //       where: [{ record_time: day15 }, { record_time: day16 }],
  //     });
  //     // 正常线路编号
  //     const whiteWiringCodes = [];
  //     isNeedCheckNValue = lastRecords.length > 0;
  //     // 需要判断N值, 过滤出异常路线, 处理一下 newWiringList
  //     if (isNeedCheckNValue) {
  //       this.ctx.logger.info('开始计算N值');
  //       for (let i = 0; i < newWiringList.length; i++) {
  //         const item = newWiringList[i];
  //         // 获取该线路昨天的数据, 和今天的数据比对差值
  //         const yesterdayRecord = await this.wiringRecordModel.findOne({
  //           where: {
  //             record_time: day1,
  //             suspicious_wiring_name: item.suspicious_wiring_name,
  //             suspicious_wiring_code: item.suspicious_wiring_code,
  //           },
  //         });
  //         // 如果没有昨日数据, 直接不再处理此条线路
  //         if (!yesterdayRecord) continue;
  //         const offsetValue = item.loss_value - yesterdayRecord.loss_value;
  //         // 获取该路线的N值: 取15条数据, 排序后取中位数
  //         const last15Records = await this.wiringRecordModel
  //           .createQueryBuilder('wiringRecord')
  //           .where(
  //             `record_time >= :day15 AND record_time <= :fileDate AND suspicious_wiring_name = :suspicious_wiring_name AND suspicious_wiring_code = :suspicious_wiring_code`,
  //             {
  //               day15,
  //               fileDate,
  //               suspicious_wiring_name: item.suspicious_wiring_name,
  //               suspicious_wiring_code: item.suspicious_wiring_name,
  //             }
  //           )
  //           .orderBy('wiringRecord.record_time', 'DESC')
  //           .limit(15)
  //           .getMany();
  //         // const last15Records = await this.wiringRecordModel.find({

  //         //   where: {
  //         //     // [{ record_time: MoreThanOrEqual(day15) }, {record_time: LessThanOrEqual(fileDate)}]
  //         //     record_time: [MoreThanOrEqual(day15), LessThanOrEqual(fileDate)],
  //         //     suspicious_wiring_name: item.suspicious_wiring_name,
  //         //     suspicious_wiring_code: item.suspicious_wiring_code,
  //         //   },
  //         //   order: {
  //         //     record_time: 'DESC'
  //         //   },
  //         //   take: 15,
  //         // });
  //         // 获取线损电量的中位数
  //         const lossValues = last15Records.map(item => item.loss_value);
  //         const n_value = this.getMiddleValue(lossValues);
  //         // 判断offsetValue和n_value比较
  //         if (+offsetValue < n_value) {
  //           this.ctx.logger.info(
  //             `${item.suspicious_wiring_name}的N值为: ${n_value}; 差值为: ${offsetValue}, 不需要记录`
  //           );
  //           // 正常线路不进行记录
  //           whiteWiringCodes.push(item.suspicious_wiring_code);
  //         }
  //       }
  //       // 过滤出异常线路
  //       newWiringList = newWiringList.filter(item => {
  //         return !whiteWiringCodes.includes(item.suspicious_wiring_code);
  //       });
  //     } else {
  //       this.ctx.logger.info(
  //         '未获取15或16天前的数据, 不计算N值, 全部视为异常线路'
  //       );
  //     }
  //     this.ctx.logger.info(`共过滤出${newWiringList.length}条异常线路`);
  //     // 获取重复数据, 删除掉
  //     // 重复数据指 线路名称,编号,日期 都和当前要插入的数据 都相同的数据
  //     const option = newWiringList.map(item => {
  //       return {
  //         record_time: item.record_time,
  //         suspicious_wiring_name: item.suspicious_wiring_name,
  //         suspicious_wiring_code: item.suspicious_wiring_code,
  //       };
  //     });
  //     const repeatRecords = await this.wiringRecordModel.find({
  //       where: {
  //         [Op.or]: option,
  //       },
  //     });
  //     if (repeatRecords.length) {
  //       await this.wiringRecordModel
  //         .destroy({
  //           where: {
  //             [Op.or]: option,
  //           },
  //         })
  //         .finally(() => {
  //           this.ctx.logger.info(`有${repeatRecords.length}条重复记录, 已删除!`);
  //         });
  //     }

  //     this.ctx.logger.info(
  //       `开始分批插入总共${newWiringList.length}条异常线路数据`
  //     );
  //     let bulkCreateWiringChunk = [];
  //     // 这个数字太大, 会有数据丢失的情况
  //     try {
  //       for (let i = 0; i < newWiringList.length; i++) {
  //         if (bulkCreateWiringChunk.length < 500) {
  //           bulkCreateWiringChunk.push(newWiringList[i]);
  //           if (i === newWiringList.length - 1) {
  //             await this.wiringRecordModel.bulkCreate(bulkCreateWiringChunk);
  //           }
  //         } else {
  //           await this.wiringRecordModel.bulkCreate(bulkCreateWiringChunk);
  //           bulkCreateWiringChunk = [newWiringList[i]];
  //         }
  //       }
  //     } catch (err) {
  //       // 更新文件进度表
  //       console.log('err', err);
  //       this.ctx.logger.error('插入数据库操作失败!');
  //       //   await updateFileProcess({
  //       //     file_code: fileCode,
  //       //     process_status: EnumFileProcessStatus.FAIL, // 解析失败
  //       //     record_time: fileDate,
  //       //   });
  //     }
  //   }
}
