import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  signup(signUpDto: SignUpDto) {
    return this.userService.signup(signUpDto);
  }

  async signin(user: User) {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return { access_token: token };
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user || !this.hashService.compare(password, user.password))
      return null;

    return user;
  }
}
