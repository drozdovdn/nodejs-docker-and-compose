import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { IdParamDto } from './dto/id-param.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@ApiTags('offers')
@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: Request): Promise<Offer> {
    return this.offersService.create(req.user.id, createOfferDto);
  }

  @Get()
  findMy(@Req() req: Request) {
    return this.offersService.findMy(req.user.id);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.offersService.findOne(id);
  }
}
