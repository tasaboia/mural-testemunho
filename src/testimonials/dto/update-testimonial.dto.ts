import { PartialType } from "@nestjs/swagger"
import { CreateTestimonialDto } from "./create-testimonial.dto"
import { IsBoolean, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {
  @ApiProperty({
    description: "Whether the testimonial is approved",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  aprovado?: boolean
} 