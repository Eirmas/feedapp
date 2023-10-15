import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsUrl()
  public avatar: string;
}
