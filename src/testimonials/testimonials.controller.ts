import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Request,
} from "@nestjs/common";
import { TestimonialsService } from "./testimonials.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("testimonials")
@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: "List all approved testimonials" })
  @ApiResponse({
    status: 200,
    description: "Testimonial list returned successfully",
  })
  async findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific testimonial" })
  @ApiResponse({ status: 200, description: "Testimonial found successfully" })
  @ApiResponse({ status: 404, description: "Testimonial not found" })
  async findOne(@Param("id") id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new testimonial" })
  @ApiResponse({ status: 201, description: "Testimonial created successfully" })
  async create(@Request() req, @Body() createTestimonialDto: any) {
    return this.testimonialsService.create(createTestimonialDto, req.user.id);
  }

  @Post(":id/like")
  @ApiOperation({ summary: 'Like a testimony' })
  @ApiResponse({ status: 200, description: 'Like registered successfully' })
  @ApiResponse({ status: 404, description: 'Testimony not found' })
  async like(
    @Param('id') id: string,
    @Body() body: { userId?: string } = {} // Valor padrão para evitar undefined
  ) {
    return this.testimonialsService.like(id, body?.userId);
  }
}
