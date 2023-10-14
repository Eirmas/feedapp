import { ApiProperty } from '@nestjs/swagger';

export class GetVotesDao {
  @ApiProperty({ type: Number })
  public yes: number;

  @ApiProperty({ type: Number })
  public no: number;
}
