import { Injectable } from '@nestjs/common';

export type User = {
  userId: number,
  username: string,
  password: string,
  email: string
};

@Injectable()
export class UsersService {
  users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'webito@mail.com'
    },
    {
      userId: 2,
      username: 'chris',
      password: 'secret',
      email: 'panito@mail.com'
    },
    {
      userId: 3,
      username: 'maria',
      password: 'guess',
      email: 'quesito@mail.com'
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}
