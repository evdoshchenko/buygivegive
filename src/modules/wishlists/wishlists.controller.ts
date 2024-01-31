import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from '../common/authorized-user';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, user);
  }

  @Delete(':id')
  removeOne(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.removeOne(id, user);
  }
}
