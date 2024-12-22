import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsEception extends HttpException {
  constructor() {
    super('Пользователь с таким именем или email уже существует', HttpStatus.BAD_REQUEST);
  }
}
