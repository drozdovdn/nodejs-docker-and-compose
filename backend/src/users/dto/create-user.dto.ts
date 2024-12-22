import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { User } from '../entities/user.entity';

export class CreateUserDto extends OmitType(User, ['password', 'email']) {
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;

  @IsString()
  password: string;
}
