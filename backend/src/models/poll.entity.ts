import { PollDomainModel, PollStatus } from 'domain-models';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import InviteEntity from './invite.entity';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';

@Entity({
  name: 'polls',
})
export default class PollEntity implements PollDomainModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
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
    default: false,
  })
  private: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;

  @Column({
    type: 'enum',
    enum: PollStatus,
    default: PollStatus.OPEN,
    nullable: false,
  })
  status: PollStatus;

  @ManyToOne(() => UserEntity, user => user.id, { eager: false, onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @OneToMany(() => VoteEntity, vote => vote.poll, {
    cascade: true,
  })
  votes: VoteEntity[];

  @OneToMany(() => InviteEntity, invite => invite.poll, {
    cascade: true,
    eager: true,
  })
  invites: InviteEntity[];
}
