import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional } from 'class-validator';

import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto extends PartialType(Wishlist) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Поле itemsId пустое' })
  @IsInt({ each: true, message: 'Поле itemsId должно содержать числа' })
  itemsId: number[];
}
