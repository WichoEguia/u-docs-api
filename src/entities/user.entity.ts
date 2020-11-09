import { Training } from './training.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppRoles } from 'src/constants';
import { Inscription } from './inscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({
    type: 'varchar',
    length: 30
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 60
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  company: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  age: number;

  @Column({
    default: true
  })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: AppRoles
  })
  role: AppRoles;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  avatar: string;

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

  @OneToMany(() => Training, training => training.user)
  trainings: Training[];

  @OneToMany(() => Inscription, inscription => inscription.user)
  inscription: Inscription;
}
