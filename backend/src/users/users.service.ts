import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserAlreadyExistsEception } from '../config/errors/user-already-exists-eception';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private hashService: HashService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async checkUser(data: { userId?: number; username?: string; email?: string }) {
    const users = await this.userRepository.find({
      where: [{ email: data?.email || '' }, { username: data.username || '' }],
    });

    if (data?.userId) {
      const nextUsers = users.filter((user) => user.id !== data.userId);
      if (nextUsers.length) {
        throw new UserAlreadyExistsEception();
      }
    } else if (users.length) {
      throw new UserAlreadyExistsEception();
    }
  }

  async getWishesByUser(username: string) {
    return this.wishesRepository.find({
      where: { owner: { username: username } },
      relations: ['owner'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findUserQuery(query: string) {
    return this.userRepository.find({ where: [{ email: query }, { username: query }] });
  }

  async findByUserName(username: string) {
    return this.userRepository.findOne({ where: { username }, relations: ['wishes', 'offers', 'wishlists'] });
  }

  async update(userId: number, username: string, updateUserDto: UpdateUserDto) {
    const { password, ...updateData } = updateUserDto;

    await this.checkUser({ userId, email: updateData.email, username: updateData.username });

    if (password) {
      const hasPassword = await this.hashService.hash(password);
      await this.userRepository.update({ username }, { ...updateData, password: hasPassword });
    } else {
      await this.userRepository.update({ username }, updateUserDto);
    }

    return await this.userRepository.find({ where: { id: userId }, relations: ['wishes', 'offers', 'wishlists'] });
  }

  async findOneById(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['wishes', 'offers', 'wishlists'] });
  }
}
