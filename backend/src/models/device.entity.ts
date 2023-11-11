import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import PollEntity from './poll.entity';

@Entity({
  name: 'devices',
})
export default class DeviceEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  connectedPollId?: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;

  @ApiProperty({ type: () => PollEntity })
  @ManyToOne(() => PollEntity, poll => poll.devices, { eager: true, onUpdate: 'CASCADE', onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'connectedPollId' })
  poll?: PollEntity;
}
