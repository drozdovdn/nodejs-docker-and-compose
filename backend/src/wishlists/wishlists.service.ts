import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(ownerId: number, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const { itemsId, ...data } = createWishlistDto;
    const items = await this.wishRepository.find({ where: { id: In(itemsId) } });
    return await this.wishlistsRepository.save({ ...data, owner: { id: ownerId }, items });
  }

  async findMe(id: number) {
    return await this.wishlistsRepository.find({
      where: { owner: { id } },
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return await this.wishlistsRepository.findOne({ where: { id }, relations: ['owner', 'items'] });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    await this.wishlistsRepository.update({ id }, updateWishlistDto);
    return await this.wishlistsRepository.findOne({ where: { id }, relations: ['owner', 'items'] });
  }

  async remove(id: number) {
    await this.wishlistsRepository.delete({ id });
  }
}
