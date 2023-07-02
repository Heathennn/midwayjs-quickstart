import { Provide } from '@midwayjs/core';
import * as dayjs from 'dayjs';
import { userRecordDTO } from '../dto/wiring';
import { UserRecord } from '../model/userRecord.model';
// import { wiringRecord } from '../model/wiringRecord.model';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
@Provide()
export class WiringService {
  @InjectEntityModel(UserRecord)
  userRecordModel: Repository<UserRecord>;
  async getUserRecord(params: userRecordDTO) {
    const whereSqls = [];
    const whereSqlMap: any = {};

    if (params.wiring_name) {
      whereSqls.push(`suspicious_wiring_name = :wiring_name`);
      whereSqlMap.wiring_name = params.wiring_name;
    }

    if (params.wiring_name) {
      whereSqls.push(`suspicious_wiring_code = :wiring_code`);
      whereSqlMap.suspicious_wiring_code = params.wiring_code;
    }

    if (params.belong_company) {
      whereSqls.push(`belong_company = :belong_company`);
      whereSqlMap.belong_company = params.belong_company;
    }

    if (params.status) {
      whereSqls.push(`status = :status`);
      whereSqlMap.status = params.status;
    }

    if (params.startDate && params.endDate) {
      whereSqls.push(
        ` userRecord.record_time >= :startDate AND  userRecord.record_time <= :endDate`
      );
      whereSqlMap.startDate = params.startDate;
      whereSqlMap.endDate = params.endDate;
    } else if (params.lastDays || params.lastDays === 0) {
      let startDate = dayjs()
        .subtract(params.lastDays, 'day')
        .format('YYYY-MM-DD');
      let endDate = dayjs().format('YYYY-MM-DD');
      whereSqls.push(` userRecord.record_time >= :startDate`);
      whereSqlMap.startDate = startDate;
      whereSqlMap.endDate = endDate;
    }

    const whereSql = whereSqls.join(` AND `);

    let queryBuilder = this.userRecordModel
      .createQueryBuilder('userRecord')
      .where(whereSql, whereSqlMap)
      .orderBy('userRecord.record_time', 'DESC');

    if (params.mode !== 'export') {
      queryBuilder = queryBuilder
        .take(params.pageSize)
        .skip((params.page - 1) * params.pageSize);
    }

    const [records, total] = await queryBuilder
      .leftJoinAndSelect('userRecord.wiringRecord', 'wiringRecord') // 第二个字段是别名. 可以在后续sql中使用
      //   .printSql()
      .getManyAndCount();

    return [records, total];
  }
}
