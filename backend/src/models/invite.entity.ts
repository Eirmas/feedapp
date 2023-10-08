import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import PollEntity from './poll.entity';
import { InviteDomainModel } from 'domain-models';

@Entity({
  name: 'invites',
})
export default class InviteEntity implements InviteDomainModel {
  @PrimaryColumn({ name: 'poll_id', type: 'uuid', nullable: false })
  pollId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @CreateDateColumn({
    name: 'created_id',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @ManyToOne(() => PollEntity, poll => poll.id, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;
}
