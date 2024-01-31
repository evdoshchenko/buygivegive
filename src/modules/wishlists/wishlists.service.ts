import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  findAll() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const user = await this.usersService.findOneById(userId);
    const wishes = await this.wishesService.findMany(createWishlistDto.itemsId);

    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) throw new BadRequestException();
    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException();
    }
    if (updateWishlistDto.itemsId) {
      const { itemsId, ...restDto } = updateWishlistDto;
      const wishes = await this.wishesService.findMany(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(id, restDto);
    } else {
      await this.wishlistRepository.update(id, updateWishlistDto);
    }

    return await this.findOne(id);
  }

  async removeOne(id: number, user: User) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException();
    }

    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
