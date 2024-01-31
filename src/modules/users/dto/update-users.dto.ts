import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(CreateUserDto) {}
