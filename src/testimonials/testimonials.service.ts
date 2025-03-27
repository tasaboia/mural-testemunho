import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimony.findMany({
      where: {
        approved: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimony.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!testimonial || !testimonial.approved) {
      throw new NotFoundException(`Testemunho com ID ${id} não encontrado`);
    }

    return testimonial;
  }

  async create(createTestimonialDto: any, userId: string) {
    return this.prisma.testimony.create({
      data: {
        ...createTestimonialDto,
        authorId: createTestimonialDto.anonymous ? null : userId,
      },
    });
  }

  async update(id: string, updateTestimonialDto: any) {
    const testimonial = await this.prisma.testimony.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testemunho com ID ${id} não encontrado`);
    }

    return this.prisma.testimony.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async like(testimonyId: string, userId: string) {
    const testimonial = await this.prisma.testimony.findUnique({
      where: { id: testimonyId },
    });

    if (!testimonial) {
      throw new NotFoundException(
        `Testemunho com ID ${testimonyId} não encontrado`
      );
    }

    // Verificar se o usuário já deu um amém neste testemunho
    const existingAmen = await this.prisma.like.findUnique({
      where: {
        testimonyId_userId: {
          testimonyId,
          userId,
        },
      },
    });

    if (existingAmen) {
      await this.prisma.like.delete({
        where: {
          id: existingAmen.id,
        },
      });

      return { message: "Amém removido com sucesso" };
    }

    await this.prisma.like.create({
      data: {
        testimonyId,
        userId,
      },
    });

    return { message: "Amém registrado com sucesso" };
  }

  async findAllForAdmin() {
    return this.prisma.testimony.findMany({
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
