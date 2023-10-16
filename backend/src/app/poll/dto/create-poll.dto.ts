import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Expose()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public private: boolean;

  @ApiPropertyOptional({ type: String, isArray: true })
  @Expose()
  @Type(() => Array<string>)
  @IsOptional()
  @IsEmail({}, { each: true })
  public emails?: string[];
}
