import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entity/notification.entity";
import { NotificationService } from "./notification.service";

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {}
