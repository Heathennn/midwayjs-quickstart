import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { wiringRecord } from './wiringRecord.model';
@Entity('suspicious_user_record')
export class UserRecord {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  belong_company: string;
  @Column()
  status: number;
  @Column()
  suspicious_user_name: string;
  @Column()
  suspicious_user_code: string;
  @Column()
  k_value: string;
  @Column()
  record_time: string;
  @Column()
  system_check_status: number;
  @Column()
  metering_name: string;
  @Column()
  metering_code: string;
  @Column()
  metering_type: string;
  @Column()
  forward_relationship: string;
  @Column()
  rate: string;
  @Column()
  reverse_relationship: string;
  @Column()
  connection_mode: string;
  @Column()
  forward_electric_quantity: string;
  @Column()
  belong_wiring_name: string;
  @Column()
  belong_wiring_code: string;
  @Column()
  capacity: string;
  @Column()
  electric_meter_no: string;
  @Column()
  forward_top_value: string;
  @Column()
  forward_bottom_value: string;
  @Column()
  reverse_top_value: string;
  @Column()
  reverse_bottom_value: string;
  @Column()
  wiring_record_id: number;
  @ManyToOne(type => wiringRecord, wiring => wiring.users)
  @JoinColumn({ name: 'wiring_record_id' })
  wiringRecord: object;
}
