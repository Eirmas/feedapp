import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  public title: string;

  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  public question: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  public private: boolean;
}
