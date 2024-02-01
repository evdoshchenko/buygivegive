import { ConflictException } from '@nestjs/common';

import { ExceptionsMessages } from './exception-messages.constants';

export class WishNotOwnsException extends ConflictException {
  constructor(message: string = ExceptionsMessages.WISH_NOT_OWNS) {
    super(message);
  }
}
