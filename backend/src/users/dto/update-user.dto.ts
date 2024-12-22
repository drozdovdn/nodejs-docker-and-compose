import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 30, { message: 'Username должен быть длиной от 2 до 30 символов' })
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;
}
