import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, id: number) {
    const user = await this.usersService.findOneById(id);
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    const money = Number(wish.raised) + createOfferDto.amount;

    if (user.id === wish.owner.id) throw new BadRequestException();
    if (money > wish.price) throw new BadRequestException();

    await this.wishesService.update(createOfferDto.itemId, {
      raised: money,
    } as UpdateWishDto);

    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });

    offers.forEach((offer) => delete offer.user.password);
    return offers;
  }

  async findOne(id: number) {
    return this.offerRepository.findOne({ where: { id } });
  }
}
