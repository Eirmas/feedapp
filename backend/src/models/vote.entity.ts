import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PollEntity from './poll.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'votes',
})
export default class VoteEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  pollId: string;

  @ApiProperty()
  @Column({
    type: 'boolean',
    nullable: false,
  })
  answer: boolean;

  @ManyToOne(() => PollEntity, poll => poll.id, { eager: false, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;
}
