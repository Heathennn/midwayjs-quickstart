import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_process')
export class fileProcess {
  @PrimaryGeneratedColumn()
  process_id: number;

  @Column()
  file_name: number;

  @Column()
  file_code: string;

  @Column()
  record_time: string;

  @Column()
  process_status: number;
}
