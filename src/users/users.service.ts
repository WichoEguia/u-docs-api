import { User } from './../common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  users = [
    {
      id: 1,
      username: 'john',
      password: 'changeme',
      email: 'webito@mail.com'
    },
    {
      id: 2,
      username: 'chris',
      password: 'secret',
      email: 'panito@mail.com'
    },
    {
      id: 3,
      username: 'maria',
      password: 'guess',
      email: 'quesito@mail.com'
    },
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async remove(id:number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
