import { AppLogger } from "@/common/service";
import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";

@Module({
    imports: [],
    providers: [AppLogger, AppGateway],
    exports: []
})
export class AppGatewayModule {}