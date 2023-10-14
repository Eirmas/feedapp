import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiProperty({ type: String, required: false })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsUrl()
  public avatar: string;
}
