import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { config } from '../common/config';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { OffersModule } from '../offers/offers.module';
import { WishlistsModule } from '../wishlists/wishlists.module';
import { AuthModule } from '../auth/auth.module';
import { HashModule } from '../hash/hash.module';
import { AppController } from './app.controller';
import { DatabaseConfig } from '../common/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
    HashModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
