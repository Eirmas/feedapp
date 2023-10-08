import { UserDomainModel } from 'domain-models';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'users',
  synchronize: false,
})
export default class UserEntity implements UserDomainModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  avatar: string;

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
}
