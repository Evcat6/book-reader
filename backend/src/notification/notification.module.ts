import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entity/notification.entity";
import { NotificationService } from "./notification.service";
import { UserModule } from "@/user/user.module";

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([NotificationEntity])
    ],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {}
