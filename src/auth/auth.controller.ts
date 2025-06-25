import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() authLoginDto: AuthLoginDto): Promise<{ message: string; data: any }> {
    const result = await this.authService.login(authLoginDto);
    return {
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard) // Protegido con el guard de JWT
  @ApiBearerAuth() // Swagger reconoce que este endpoint necesita un token JWT
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Token válido.' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado.' })
  verify(): { message: string } {
    return { message: 'Token válido' };
  }
}
