import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationEntity } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/user/entity/user.entity";
import { UserService } from "@/user/user.service";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>,
        private readonly userService: UserService
    ) { }

    public async create(userId: string, message: string) {
        const user = await this.userService.findById(userId);
        if(!user) throw new NotFoundException("User Not Found");
        console.log(user);
        const newNotification = new NotificationEntity(message, user);
        return await this.notificationRepository.save(newNotification);
    }

    public async load(userId: string, limit: number, offset: number = 0) {
        return await this.notificationRepository.find({
            where: { user: { id: userId } },
            skip: offset,
            take: limit
        });
    }
}