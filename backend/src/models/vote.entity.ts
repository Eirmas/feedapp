import { VoteDomainModel } from 'domain-models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PollEntity from './poll.entity';

@Entity({
  name: 'votes',
})
export default class VoteEntity implements VoteDomainModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  pollId: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  answer: boolean;

  @ManyToOne(() => PollEntity, poll => poll.id, { eager: false, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;
}
