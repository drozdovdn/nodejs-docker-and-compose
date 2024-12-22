import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsernameParamDto } from './dto/username-param.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseInterceptors(new ClassSerializerInterceptor(new Reflector(), { groups: ['me'] }))
  findMe(@Req() req: Request) {
    return req.user;
  }

  @Get('me/wishes')
  findMeWishes(@Req() req: Request) {
    const { user } = req;

    return this.usersService.getWishesByUser(user.username);
  }

  @Patch('me')
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const { user } = req;

    return this.usersService.update(user.id, user.username, updateUserDto);
  }

  @Get(':username')
  findOne(@Param() { username }: UsernameParamDto) {
    return this.usersService.findByUserName(username);
  }

  @Get(':username/wishes')
  findOneWishes(@Param() { username }: UsernameParamDto) {
    return this.usersService.getWishesByUser(username);
  }

  @Post('find')
  find(@Body() body: FindUserDto) {
    return this.usersService.findUserQuery(body.query);
  }
}
