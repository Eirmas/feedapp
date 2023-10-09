import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import PollEntity from '../../../models/poll.entity';

export class UpdatePollDto extends PartialType(PollEntity) {
  @ApiProperty({ type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public title: string;

  @ApiProperty({ type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public question: string;

  @ApiProperty({ type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public private: boolean;
}
