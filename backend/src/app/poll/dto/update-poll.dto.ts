import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePollDto {
  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public title: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public question: string;

  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public private: boolean;
}
