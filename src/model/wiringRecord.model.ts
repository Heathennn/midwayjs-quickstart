import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRecord } from './userRecord.model';
@Entity('suspicious_wiring_record')
export class wiringRecord {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  suspicious_wiring_name: string;
  @Column()
  record_time: string;
  @Column()
  suspicious_wiring_code: string;
  @Column()
  line_loss_rate: string;
  @Column()
  loss_value: string;
  @Column()
  in_value: string;
  @Column()
  out_value: string;
  @Column()
  sell_value: string;
  @Column()
  transformer_name: string;
  @Column()
  belong_company: string;
  @OneToMany(type => UserRecord, user => user.wiringRecord)
  users: UserRecord[];
}
