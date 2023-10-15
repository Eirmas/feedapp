import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import PollEntity from './poll.entity';

@Entity({
  name: 'users',
  synchronize: false,
})
export default class UserEntity {
  @ApiProperty()
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  avatar: string;

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
}
