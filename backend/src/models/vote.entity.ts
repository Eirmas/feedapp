import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import PollEntity from './poll.entity';
import UserEntity from './user.entity';
import { VoteDomainModel } from 'domain-models';

@Entity({
  name: 'votes',
})
export default class VoteEntity implements VoteDomainModel {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn({ name: 'poll_id', type: 'uuid', nullable: false })
  pollId: string;

  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId?: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  answer: boolean;

  @ManyToOne(() => PollEntity, poll => poll.id, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;

  @ManyToOne(() => UserEntity, user => user.id, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
