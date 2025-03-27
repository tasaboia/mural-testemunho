import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import type { GoogleUserDto } from "./dto/google-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateGoogleUser(googleUserDto: GoogleUserDto) {
    // Verificar se o usuário já existe
    let user = await this.prisma.user.findUnique({
      where: { email: googleUserDto.email },
    });

    // Se não existir, criar um novo usuário
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUserDto.email,
          name: googleUserDto.nome,
          profileImage: googleUserDto.imagemPerfil,
        },
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        imagemPerfil: user.imagemPerfil,
        role: user.role,
      },
    };
  }
}
