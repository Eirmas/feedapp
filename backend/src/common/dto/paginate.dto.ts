import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class PaginateDto {
  @ApiProperty({ type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  public skip: number;

  @ApiProperty({ type: Number, required: false })
  @Expose()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Max(100)
  public take: number;
}
