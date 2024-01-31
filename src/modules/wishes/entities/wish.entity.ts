import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  IsUrl,
  Length,
  IsNumber,
  IsPositive,
  IsDecimal,
} from 'class-validator';

import { BaseEntity } from '../../common/base-entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
