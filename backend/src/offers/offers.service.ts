import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wish } from '../wishes/entities/wish.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async examinationSum(createOfferDto: CreateOfferDto) {
    const { itemId, ...createOffer } = createOfferDto;
    const wish = await this.wishesRepository.findOne({ where: { id: itemId }, relations: ['owner'] });
    const amountOffer = +createOffer.amount;
    const priceWish = +wish.price;
    const raisedtWish = +wish.raised || 0;

    const notEnoughSum = priceWish - raisedtWish;

    if (priceWish === raisedtWish) {
      throw new UnauthorizedException('Необходимая сумма уже собрана');
    }

    if (notEnoughSum < amountOffer) {
      throw new UnauthorizedException(`Сумма превышает недостающий максимум ${notEnoughSum}`);
    }

    return wish;
  }

  async addRaisedWish(userId: number, wish: Wish) {
    if (userId === wish.owner.id) {
      throw new UnauthorizedException(`Нельзя поддержать свой подарок`);
    }
  }

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const { itemId, ...createOffer } = createOfferDto;

    const wish = await this.examinationSum(createOfferDto);
    await this.addRaisedWish(userId, wish);

    const offer = await this.offerRepository.save({ ...createOffer, user: { id: userId }, wish });

    await this.wishesRepository.update({ id: itemId }, { ...wish, raised: +wish.raised + +createOffer.amount });

    return offer;
  }

  async findMy(id: number) {
    return this.offerRepository.find({ where: { user: { id } }, relations: ['wish', 'user'] });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({ where: { id }, relations: ['wish', 'user'] });
  }
}
