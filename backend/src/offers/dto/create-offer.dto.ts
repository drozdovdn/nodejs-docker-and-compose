import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends PartialType(Offer) {
  @IsNumber()
  itemId: number;
}
