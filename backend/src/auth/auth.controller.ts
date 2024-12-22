import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: Request) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    console.log({ createUserDto });
    return this.authService.signUp(createUserDto);
  }
}
