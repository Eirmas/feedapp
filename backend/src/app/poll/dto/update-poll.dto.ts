import { ApiProperty, PartialType } from '@nestjs/swagger';
import PollEntity from '../../../models/poll.entity';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PollStatus } from 'domain-models';

export class UpdatePollDto extends PartialType(PollEntity) {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public title: string;

  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public question: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public private: boolean;

  @ApiProperty({ type: PollStatus })
  @Expose()
  @IsOptional()
  @IsEnum(PollStatus)
  public status: PollStatus;
}
