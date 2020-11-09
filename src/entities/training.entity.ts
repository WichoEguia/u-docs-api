import { TrainingTypes } from './../constants';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne, CreateDateColumn } from "typeorm";

import { User } from './user.entity';
import { Inscription } from './inscription.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  idTraining: number;

  @Column({
    length: 150
  })
  title: string;

  @Column({
    length: 250
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TrainingTypes
  })
  type: TrainingTypes;

  @Column({
    type: 'boolean',
    default: false
  })
  is_active: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  created_at: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at: string;

  @ManyToOne(() => User, user => user.trainings)
  @JoinColumn({ name: "idUser" })
  user: User;

  @OneToMany(() => Inscription, inscription => inscription.training)
  inscription: Inscription;
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  idToken: number;
  
  @Column({
    default: 'u-docs',
    length: 100
  })
  token: string;

  @CreateDateColumn({
    type: "timestamp"
  })
  expiration_date: string;

  @Column({
    type: 'boolean',
    default: true
  })
  is_active: boolean;

  @OneToOne(() => Training)
  @JoinColumn({
    name: 'idTraining'
  })
  training: Training;
}