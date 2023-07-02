import { Rule, RuleType } from '@midwayjs/validate';

export class userRecordDTO {
  @Rule(RuleType.number().required())
  page: number;
  @Rule(RuleType.number().required())
  pageSize: number;
  @Rule(RuleType.string().allow(''))
  wiring_name: string;
  @Rule(RuleType.string().allow(''))
  wiring_code: string;
  @Rule(RuleType.number().allow(''))
  status: number;
  @Rule(RuleType.number().allow(null))
  lastDays: number;
  @Rule(RuleType.string().allow(''))
  startDate: string;
  @Rule(RuleType.string().allow(''))
  endDate: string;
  @Rule(RuleType.string().allow(''))
  mode: string;
  @Rule(RuleType.string().allow(''))
  belong_company: string;
}
