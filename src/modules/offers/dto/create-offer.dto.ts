import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
