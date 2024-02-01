import { ConflictException } from '@nestjs/common';

import { ExceptionsMessages } from './exception-messages.constants';

export class WishAlreadyExistException extends ConflictException {
  constructor(message: string = ExceptionsMessages.WISH_ALREADY_EXIST) {
    super(message);
  }
}
