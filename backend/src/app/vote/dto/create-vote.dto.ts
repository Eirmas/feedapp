import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({ type: Boolean })
  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  public answer: boolean;
}
