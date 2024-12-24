import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { Offer } from './offers/entities/offer.entity';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Wish } from './wishes/entities/wish.entity';
import { WishesModule } from './wishes/wishes.module';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService ) => ({
             type: 'postgres',
             host: configService.get<string>('POSTGRES_HOST'),
             port: configService.get<number>('POSTGRES_PORT'),
             username: configService.get<string>('POSTGRES_USER'),
             password: configService.get<string>('POSTGRES_PASSWORD'),
             database: configService.get<string>('POSTGRES_DB'),
             entities: [User, Offer, Wish, Wishlist],
             synchronize: true,
        }),
        inject: [ConfigService],
      }),
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigModule глобальным, чтобы он был доступен во всех модулях
      envFilePath: '.env', // Указываем путь к файлу .env (по умолчанию корень проекта)
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
