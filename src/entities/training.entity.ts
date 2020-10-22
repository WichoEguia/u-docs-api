import { TrainingTypes } from './../constants';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";

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
  type: string;

  @Column({
    type: 'integer',
    default: 50
  })
  storage: number;

  @Column({
    type: 'float',
    default: 900
  })
  price: number;

  @Column({
    type: 'boolean',
    default: true
  })
  is_active: boolean;

  @Column({
    type: 'timestamp'
  })
  created_at: string;

  @Column({
    type: 'timestamp',
    nullable: true
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

  @Column({
    type: 'timestamp'
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