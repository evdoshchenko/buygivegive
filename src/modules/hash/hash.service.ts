import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class HashService {
  getHash(password: string) {
    return hashSync(password, genSaltSync());
  }

  compare(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
