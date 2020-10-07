import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum userRole {
  student = 1,
  teacher = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column('text')
  password: string;

  @Column('text')
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('enum', { enum: userRole })
  role: string;
}
