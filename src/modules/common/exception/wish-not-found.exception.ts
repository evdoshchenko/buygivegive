import { ConflictException } from '@nestjs/common';

import { ExceptionsMessages } from './exception-messages.constants';

export class WishNotFoundException extends ConflictException {
  constructor(message: string = ExceptionsMessages.WISH_NOT_FOUND) {
    super(message);
  }
}
