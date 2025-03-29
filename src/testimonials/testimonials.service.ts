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

  async like(testimonyId: string, userId?: string) {
    // Primeiro, verifica se o testemunho existe
    const testimony = await this.prisma.testimony.findUnique({
      where: { id: testimonyId },
      include: {
        _count: {
          select: { likes: true }
        }
      }
    });

    if (!testimony) {
      throw new NotFoundException(`Testimony with ID ${testimonyId} not found`);
    }

    // Se não tiver userId, apenas retorna a contagem atual
    if (!userId) {
      return {
        likes: testimony._count.likes,
        message: "Current like count"
      };
    }

    // Se tiver userId, procura se já existe um like
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId,
        testimonyId,
      },
    });

    if (existingLike) {
      // Remove o like se já existir
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return { 
        message: "Like removed successfully",
        likes: testimony._count.likes - 1
      };
    }

    // Adiciona um novo like
    await this.prisma.like.create({
      data: {
        testimonyId,
        userId,
      },
    });

    return { 
      message: "Like added successfully",
      likes: testimony._count.likes + 1
    };
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
