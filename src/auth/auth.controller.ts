import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import type { GoogleUserDto } from "./dto/google-user.dto"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({ summary: 'Autenticar com Google' })
  @ApiResponse({ status: 201, description: 'Usuário autenticado com sucesso' })
  async googleAuth(@Body() googleUserDto: GoogleUserDto) {
    const user = await this.authService.validateGoogleUser(googleUserDto);
    return this.authService.login(user);
  }
}

