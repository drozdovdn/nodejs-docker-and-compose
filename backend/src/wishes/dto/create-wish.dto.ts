import { PartialType } from '@nestjs/swagger';

import { Wish } from '../entities/wish.entity';

export class CreateWishDto extends PartialType(Wish) {}
