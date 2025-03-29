import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { TestimonialsService } from "../testimonials/testimonials.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("admin")
@Controller("admin/testimonials")
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: "List all testimonials (admin)" })
  @ApiResponse({
    status: 200,
    description: "Testimonial list returned successfully",
  })
  async findAll() {
    return this.testimonialsService.findAllForAdmin();
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a testimonial (admin)" })
  @ApiResponse({ status: 200, description: "Testimonial updated successfully" })
  @ApiResponse({ status: 404, description: "Testimonial not found" })
  async update(@Param("id") id: string, @Body() updateTestimonialDto: any) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }
}
