import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @ApiProperty({ type: Boolean, required: false })
  @Expose()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public private: boolean;

  @ApiProperty({ type: String, required: false, isArray: true })
  @Expose()
  @Type(() => Array<String>)
  @IsOptional()
  @IsEmail({}, { each: true })
  public emails?: string[];
}
