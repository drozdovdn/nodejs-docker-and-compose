import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions, permissions } from '../config/permissions';
import { CreateWishDto } from './dto/create-wish.dto';
import { IdParamDto } from './dto/id-param.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: Request, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }
  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @CheckPermissions(permissions.EDIT_WISH)
  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(id, updateWishDto);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @CheckPermissions(permissions.EDIT_WISH)
  @Delete(':id')
  remove(@Param() { id }: IdParamDto, @Res() res: Response) {
    this.wishesService.remove(id).then(() => res.send({ message: 'Подарок успешно удален' }));
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param() { id }: IdParamDto, @Req() req: Request) {
    return this.wishesService.copy(req.user.id, id);
  }
}
