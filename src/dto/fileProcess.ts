import { Rule, RuleType } from '@midwayjs/validate';

export class fileProcessDTO {
  @Rule(RuleType.string().required())
  file_code: string;

  @Rule(RuleType.string().allow(''))
  record_time: string;
}

export class fileProcessItemDTO {
  @Rule(RuleType.string().required())
  file_code: string;
  @Rule(RuleType.string().required())
  record_time: string;
  @Rule(RuleType.string().allow(''))
  file_name: string;
  @Rule(RuleType.number().allow(null))
  process_status: number;
}
