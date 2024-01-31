import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.userService.findOneById(id);
    return this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  findLast() {
    return this.wishRepository.find({
      order: { createdAt: 'desc' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  findTop() {
    return this.wishRepository.find({
      take: 10,
      order: { copied: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) throw new BadRequestException();
    return wish;
  }

  async update(wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(wishId);
    if (updateWishDto.price && wish.offers.length > 0)
      throw new BadRequestException();

    await this.wishRepository.update(wishId, updateWishDto);
    return this.findOne(wishId);
  }

  async removeOne(id: number, user: User) {
    const wish = await this.findOne(id);
    if (user && wish.owner.id !== user.id) throw new BadRequestException();
    if (wish.offers.length > 0) throw new BadRequestException();

    await this.wishRepository.delete(id);
    return wish;
  }

  async copy(id: number, user: User) {
    const { copied, ...dataWish } = await this.findOne(id);
    const owner = await this.userService.findOneById(user.id);
    await this.wishRepository.update(id, { copied: copied + 1 });
    return this.wishRepository.save({
      ...dataWish,
      owner,
    });
  }

  findMany(giftsId: number[]) {
    return this.wishRepository.find({
      where: { id: In(giftsId) },
    });
  }
}
