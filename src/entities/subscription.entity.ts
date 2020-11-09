import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User, Training } from './index';
import { PaymentMethods } from 'src/constants';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  idSubscription: number;

  @CreateDateColumn({
    type: "timestamp",
    nullable: true
  })
  start_at: string;

  @Column({
    type: 'boolean',
    default: false
  })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: PaymentMethods
  })
  method: PaymentMethods;

  @Column({
    type: 'longtext'
  })
  metadata: string;

  @OneToOne(() => User, {
    nullable: false
  })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToOne(() => Training, {
    nullable: false
  })
  @JoinColumn({ name: 'idTraining' })
  training: Training;
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  idPayment: number;

  @Column({
    type: 'float',
    default: 700.00
  })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  date: string;

  @Column({
    type: 'longtext'
  })
  metadata: string;

  @OneToOne(() => Subscription, {
    nullable: false
  })
  @JoinColumn({ name: 'idSubscription' })
  subscription: Subscription;
}