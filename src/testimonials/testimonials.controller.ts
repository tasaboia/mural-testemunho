import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from "@nestjs/common"
import { TestimonialsService } from "./testimonials.service"
import type { CreateTestimonialDto } from "./dto/create-testimonial.dto"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("testimonials")
@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: "List all approved testimonials" })
  @ApiResponse({ status: 200, description: "Testimonial list returned successfully" })
  async findAll() {
    return this.testimonialsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial found successfully' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  async findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new testimonial" })
  @ApiResponse({ status: 201, description: "Testimonial created successfully" })
  async create(@Request() req, @Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto, req.user.id)
  }

  @Put(":id/like")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Give an "Amen" to a testimonial' })
  @ApiResponse({ status: 200, description: "Amen registered successfully" })
  @ApiResponse({ status: 404, description: "Testimonial not found" })
  async like(@Param('id') id: string, @Request() req) {
    return this.testimonialsService.like(id, req.user.id)
  }
} 