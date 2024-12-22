import { IsNumber, IsOptional, IsUrl, Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250, { message: 'Название подарка должно быть длиной от 1 до 250 символов' })
  name: string;

  @Column()
  @IsUrl({}, { message: 'Ссылка на магазин должна быть корректным URL' })
  link: string;

  @Column()
  @IsUrl({}, { message: 'Ссылка на изображение должна быть корректным URL' })
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'Сумма сбора должна быть числом' })
  @Min(0, { message: 'Сумма сбора не может быть отрицательной' })
  raised: number;

  @Column({ length: 1024 })
  @Length(1, 1024, { message: 'Описание должно быть длиной от 1 до 1024 символов' })
  description: string;

  @Column({ type: 'int', default: 0 })
  @IsOptional()
  @Min(0, { message: 'Количество скопированных подарков не может быть отрицательным' })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];
}
