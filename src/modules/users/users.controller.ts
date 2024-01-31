import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUsersDto } from './dto/update-users.dto';
import { FindUserDto } from './dto/find-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../common/authorized-user';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@AuthUser() user: User) {
    return this.usersService.findOneById(user.id);
  }

  @Patch('me')
  update(@AuthUser() user, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(user.id, updateUsersDto);
  }

  @Get('me/wishes')
  getOwnWishes(@AuthUser() user: User) {
    return this.usersService.getWishes(user.username);
  }

  @Get(':username')
  async getOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  async findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.find(findUserDto);
  }
}
