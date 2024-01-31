import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-users.dto';
import { User } from './entities/user.entity';
import { UpdateUsersDto } from './dto/update-users.dto';
import { FindUserDto } from './dto/find-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  private async existUser(username: string, email: string) {
    const existUsername = await this.userRepository.findOne({
      where: { username },
    });
    const existEmail = await this.userRepository.findOne({ where: { email } });

    if (existUsername || existEmail) return true;

    return false;
  }

  async signup(createUserDto: CreateUserDto) {
    const existUser = await this.existUser(
      createUserDto.username,
      createUserDto.email,
    );

    if (existUser) throw new BadRequestException();

    const { ...user } = await this.userRepository.save({
      username: createUserDto.username,
      about: createUserDto.about,
      avatar: createUserDto.avatar,
      email: createUserDto.email,
      password: this.hashService.getHash(createUserDto.password),
    });
    return user;
  }

  async findOne(searchIndex: string) {
    return this.userRepository.findOne({
      where: [{ email: searchIndex }, { username: searchIndex }],
    });
  }

  async findOneById(id: number) {
    const { ...user } = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async update(id: number, updateUsersDto: UpdateUsersDto) {
    const user = await this.findOneById(id);
    if (updateUsersDto.username && updateUsersDto.username !== user.username) {
      const isUsernameExist = await this.findOne(updateUsersDto.username);
      if (isUsernameExist) throw new BadRequestException();
    }
    if (updateUsersDto.email && updateUsersDto.email !== user.email) {
      const isEmailExist = await this.findOne(updateUsersDto.email);
      if (isEmailExist) throw new BadRequestException();
    }
    if (updateUsersDto.password) {
      updateUsersDto.password = this.hashService.getHash(
        updateUsersDto.password,
      );
    }

    await this.userRepository.update(id, updateUsersDto);
    return this.findOneById(id);
  }

  async getWishes(username: string) {
    const user = await this.findOne(username);
    if (!user) throw new BadRequestException();
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return wishes;
  }

  find(findUserDto: FindUserDto) {
    return this.userRepository.find({
      where: [
        { username: Like(`%${findUserDto.query}%`) },
        { email: Like(`%${findUserDto.query}%`) },
      ],
    });
  }
}
