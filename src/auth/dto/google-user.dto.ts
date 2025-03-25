import { IsEmail, IsString, IsUrl, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class GoogleUserDto {
  @ApiProperty({
    description: "Email do usuário do Google",
    example: "usuario@gmail.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "Nome do usuário do Google",
    example: "João Silva",
  })
  @IsString()
  nome: string

  @ApiProperty({
    description: "URL da imagem de perfil do usuário do Google",
    example: "https://lh3.googleusercontent.com/a/ACg8ocLt...",
  })
  @IsUrl()
  @IsOptional()
  imagemPerfil?: string
}

