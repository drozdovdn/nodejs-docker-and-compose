import { IsOptional, IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250, { message: 'Название списка должно быть длиной от 1 до 250 символов' })
  name: string;

  @Column({ length: 1500, nullable: true })
  @Length(0, 1500, { message: 'Описание должно быть длиной до 1500 символов' })
  @IsOptional()
  description?: string;

  @Column()
  @IsUrl({}, { message: 'Ссылка на обложку должна быть корректным URL' })
  @IsOptional()
  image?: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
