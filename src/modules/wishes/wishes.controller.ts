import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from '../common/authorized-user';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@AuthUser() user, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(user.id, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishesService.update(id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeOne(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.removeOne(id, user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copy(id, user);
  }
}
