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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { IdParamDto } from './dto/id-param.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@ApiTags('wishlistlists')
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req: Request, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get()
  findMe(@Req() req: Request) {
    return this.wishlistsService.findMe(req.user.id);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions(permissions.EDIT_WISHLIST)
  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistsService.update(id, updateWishlistDto);
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions(permissions.EDIT_WISHLIST)
  @Delete(':id')
  remove(@Param() { id }: IdParamDto, @Res() res: Response) {
    this.wishlistsService.remove(id).then(() => res.send({ message: 'Вишлист успешно удален' }));
  }
}
