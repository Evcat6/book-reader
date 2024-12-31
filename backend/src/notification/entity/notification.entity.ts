import { UserEntity } from '@/user/entity/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'notifications' })
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar', nullable: false })
    public message: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @Column({ type: 'boolean', default: false })
    public isViewed: boolean;

    @ApiHideProperty()
    @ManyToOne(() => UserEntity, (user) => user.books)
    @Exclude()
    public user: UserEntity;

    constructor(message: string, user: UserEntity) {
        this.message = message;
        this.user = user;
    }
}