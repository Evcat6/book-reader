import { AppLogger } from "@/common/service";
import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { UserModule } from "@/user/user.module";
import { NotificationModule } from "@/notification/notification.module";

@Module({
    imports: [UserModule, NotificationModule],
    providers: [AppLogger, AppGateway],
    exports: []
})
export class AppGatewayModule {}