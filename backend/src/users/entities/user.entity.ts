import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity('users')
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 30, unique: true })
  @Length(2, 30, { message: 'Username должен быть длиной от 2 до 30 символов' })
  username: string;

  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200, { message: 'About должен быть длиной от 2 до 200 символов' })
  @IsOptional()
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl({}, { message: 'Avatar должен быть корректной ссылкой' })
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @Expose({ groups: ['me'] })
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;

  @Column()
  @IsString()
  @Expose({ groups: ['me'] })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
