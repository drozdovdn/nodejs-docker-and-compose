import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashService } from '../hash/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private hashService: HashService, private jwtService: JwtService, private usersService: UsersService) {}
  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUserName(username);

    if (user) {
      const isValid = await this.hashService.compare(password, user.password);
      if (isValid) {
        const { password, ...data } = user;
        return data;
      }
    }
    return null;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...data } = createUserDto;

    console.log({ data, password });
    await this.usersService.checkUser({ email: data?.email, username: data?.username });

    const hasPassword = await this.hashService.hash(password);
    const nextUser = await this.usersService.create({ ...data, password: hasPassword });

    return this.auth(nextUser);
  }
}
