import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import InviteEntity from './invite.entity';
import UserEntity from './user.entity';
import VoteEntity from './vote.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export enum PollStatus {
  OPEN = 'open',
  CLOSED = 'closed',
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

  @ApiProperty()
  @Expose()
  public get ownerName(): string {
    return this.owner.name;
  }

  @ApiProperty()
  @Expose()
  public get ownerAvatar(): string {
    return this.owner.avatar;
  }

  @Exclude()
  @ManyToOne(() => UserEntity, user => user.id, { eager: true, onDelete: 'CASCADE' })
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
