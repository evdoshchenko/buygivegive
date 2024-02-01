import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { WishNotFoundException } from '../common/exception/wish-not-found.exception';
import { WishAlreadyExistException } from '../common/exception/wish-already-exists.exception';
import { WishNotOwnsException } from '../common/exception/wish-not-owns.exception';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.usersService.findOneById(id);
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

  async update(wishId: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.findOne(wishId);
    if (updateWishDto.price && wish.offers.length > 0)
      throw new BadRequestException();
    if (user && wish.owner.id !== user.id) throw new WishNotOwnsException();

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
    const wish = await this.findOne(id);
    if (!wish) throw new WishNotFoundException();
    else if (wish.owner.id === user.id) throw new WishAlreadyExistException();
    const copyWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      copied: wish.copied + 1,
      description: wish.description,
    };
    const copyWish = await this.create(user.id, copyWishDto);
    return copyWish;
  }

  findMany(giftsId: number[]) {
    return this.wishRepository.find({
      where: { id: In(giftsId) },
    });
  }
}
