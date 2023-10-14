import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import InviteEntity from './invite.entity';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum PollStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity({
  name: 'polls',
})
export default class PollEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  ownerId: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  question: string;

  @ApiProperty()
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  private: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;

  @ApiProperty({ enum: PollStatus })
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

  @ApiProperty()
  @OneToMany(() => InviteEntity, invite => invite.poll, {
    cascade: true,
    eager: true,
  })
  invites: InviteEntity[];
}
