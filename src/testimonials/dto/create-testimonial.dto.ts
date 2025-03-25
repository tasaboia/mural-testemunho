import { IsString, IsBoolean, IsEnum, IsOptional, MinLength, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Categoria } from "@prisma/client"

export class CreateTestimonialDto {
  @ApiProperty({
    description: "Testimonial title",
    example: "Miracle in my family",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  titulo: string

  @ApiProperty({
    description: "Testimonial content",
    example: "God worked a miracle in my son's life...",
  })
  @IsString()
  @MinLength(10)
  conteudo: string

  @ApiProperty({
    description: "Whether the testimonial should be anonymous",
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  anonimo?: boolean = false

  @ApiProperty({
    description: "Testimonial category",
    enum: Categoria,
    example: Categoria.CURA,
  })
  @IsEnum(Categoria)
  categoria: Categoria
} 