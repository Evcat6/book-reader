import { Injectable } from "@nestjs/common";
import { NotificationEntity } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/user/entity/user.entity";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>
    ) {}

    public async create(message: string, user: UserEntity) {
        const newNotification = new NotificationEntity(message, user);
        return await this.notificationRepository.save(newNotification);
    }
}