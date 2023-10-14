import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import PollEntity from './poll.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'invites',
})
export default class InviteEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  pollId: string;

  @ApiProperty()
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @ManyToOne(() => PollEntity, poll => poll.id, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;
}
