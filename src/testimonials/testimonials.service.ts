import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import type { UpdateTestimonialDto } from "./dto/update-testimonial.dto"
import { CreateTestimonialDto } from "./dto/create-testimonial.dto"

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testemunho.findMany({
      where: {
        aprovado: true,
      },
      include: {
        autor: {
          select: {
            id: true,
            nome: true,
            imagemPerfil: true,
          },
        },
        _count: {
          select: {
            amens: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testemunho.findUnique({
      where: { id },
      include: {
        autor: {
          select: {
            id: true,
            nome: true,
            imagemPerfil: true,
          },
        },
        _count: {
          select: {
            amens: true,
          },
        },
      },
    })

    if (!testimonial || !testimonial.aprovado) {
      throw new NotFoundException(`Testemunho com ID ${id} não encontrado`)
    }

    return testimonial
  }

  async create(createTestimonialDto: CreateTestimonialDto, userId: string) {
    return this.prisma.testemunho.create({
      data: {
        ...createTestimonialDto,
        autorId: createTestimonialDto.anonimo ? null : userId,
      },
    })
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    const testimonial = await this.prisma.testemunho.findUnique({
      where: { id },
    })

    if (!testimonial) {
      throw new NotFoundException(`Testemunho com ID ${id} não encontrado`)
    }

    return this.prisma.testemunho.update({
      where: { id },
      data: updateTestimonialDto,
    })
  }

  async like(testimonialId: string, userId: string) {
    const testimonial = await this.prisma.testemunho.findUnique({
      where: { id: testimonialId },
    })

    if (!testimonial) {
      throw new NotFoundException(`Testemunho com ID ${testimonialId} não encontrado`)
    }

    // Verificar se o usuário já deu um amém neste testemunho
    const existingAmen = await this.prisma.amem.findUnique({
      where: {
        testemunhoId_usuarioId: {
          testemunhoId: testimonialId,
          usuarioId: userId,
        },
      },
    })

    if (existingAmen) {
      // Se já existe, remove o amém (toggle)
      await this.prisma.amem.delete({
        where: {
          id: existingAmen.id,
        },
      })

      return { message: "Amém removido com sucesso" }
    }

    // Se não existe, cria um novo amém
    await this.prisma.amem.create({
      data: {
        testemunhoId: testimonialId,
        usuarioId: userId,
      },
    })

    return { message: "Amém registrado com sucesso" }
  }

  async findAllForAdmin() {
    return this.prisma.testemunho.findMany({
      include: {
        autor: {
          select: {
            id: true,
            nome: true,
            email: true,
            imagemPerfil: true,
          },
        },
        _count: {
          select: {
            amens: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
} 