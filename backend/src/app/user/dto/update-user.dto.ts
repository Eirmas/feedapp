import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../../../models';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(UserEntity) {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public given_name: string;

  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public family_name: string;
}
