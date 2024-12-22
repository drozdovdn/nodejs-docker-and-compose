import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(0.01, { message: 'Сумма должна быть положительной и больше 0' })
  amount: number;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'Hidden должен быть булевым значением' })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  wish: Wish;
}
