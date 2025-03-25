import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TestimonialsModule } from "./testimonials/testimonials.module"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { AdminModule } from "./admin/admin.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TestimonialsModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}

