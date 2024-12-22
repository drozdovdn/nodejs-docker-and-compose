import { Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(ownerId: number, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishesRepository.save({ ...createWishDto, owner: { id: ownerId } });
    return await this.wishesRepository.findOne({ where: { id: wish.id }, relations: ['owner', 'offers'] });
  }

  async getLastWishes() {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC', //Сортировка по дате создания (последние сначала)
      },
      take: 40,
      relations: ['owner'],
    });
  }

  async getTopWishes() {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({ where: { id }, relations: ['owner', 'offers', 'offers.user'] });

    if (!wish) {
      throw new UnauthorizedException('Подарка с таким id не существует');
    }

    // Добавляем поле name в каждый offer
    if (wish) {
      wish.offers = wish.offers.map((offer) => ({
        ...offer,
        name: offer.user?.username,
        img: offer.user?.avatar,
      }));
    }
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({ where: { id }, relations: ['owner', 'offers', 'offers.user'] });

    if (!wish) {
      throw new UnauthorizedException('Подарка с таким id не существует');
    }
    await this.wishesRepository.update({ id }, updateWishDto);

    return { ...wish, ...updateWishDto };
  }

  async remove(id: number) {
    await this.wishesRepository.delete({ id });
  }

  async copy(idOwner: number, idWish: number) {
    // Проверяем, что желание с таким ID существует
    const originalWish = await this.wishesRepository.findOne({ where: { id: idWish } });
    if (!originalWish) {
      throw new UnauthorizedException(`Подарок с таким ID ${idWish} не найден`);
    }
    const { id, createdAt, updatedAt, copied, ...data } = originalWish;

    await this.wishesRepository.update({ id }, { ...originalWish, copied: originalWish.copied + 1 });

    return this.wishesRepository.save({ ...data, owner: { id: idOwner } });
  }
}
