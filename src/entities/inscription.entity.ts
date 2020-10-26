import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  created_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at: Date;

  @Column({
    default: true
  })
  is_active: boolean;
}