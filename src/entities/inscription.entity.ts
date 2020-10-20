import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from 'src/entities/user.entity';
import { Training } from "./training.entity";

@Entity()
export class Inscription {
  @PrimaryGeneratedColumn()
  idInscription: number;

  @ManyToOne(() => Training, training => training.inscription)
  @JoinColumn({
    name: 'idTraining'
  })
  training: Training;

  @ManyToOne(() => User, user => user.inscription)
  @JoinColumn({
    name: 'idUser'
  })
  user: User;

  @Column({
    type: 'timestamp'
  })
  created_at: string;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  updated_at: string;

  @Column({
    default: true
  })
  is_active: boolean;
}