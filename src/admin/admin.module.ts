import { Module } from "@nestjs/common"
import { AdminController } from "./admin.controller"
import { TestimonialsModule } from "../testimonials/testimonials.module"

@Module({
  imports: [TestimonialsModule],
  controllers: [AdminController],
})
export class AdminModule {}

