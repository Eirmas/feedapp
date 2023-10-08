import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';
import InviteEntity from './invite.entity';
import { PollDomainModel, PollStatus } from 'domain-models';

@Entity({
  name: 'polls',
})
export default class PollEntity implements PollDomainModel {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  question: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  private: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;

  @Column({
    type: 'enum',
    enum: PollStatus,
    default: 'open',
    nullable: false,
  })
  status: PollStatus;

  @ManyToOne(() => UserEntity, user => user.id, { eager: true, onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @OneToMany(() => VoteEntity, vote => vote.pollId, {
    cascade: true,
  })
  votes: VoteEntity[];

  @OneToMany(() => InviteEntity, invite => invite.pollId, {
    cascade: true,
    eager: true,
  })
  invites: InviteEntity[];
}
