import { IsString, Length } from 'class-validator';

export class UsernameParamDto {
  @IsString()
  @Length(2, 30, { message: 'Username должен быть длиной от 2 до 30 символов' })
  username: string;
}
