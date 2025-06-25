import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('mi-perfil')
  async findAuthenticatedUser(@Req() req: any) {
    const userId = req.user.id; // Extrae el ID del usuario autenticado desde el token
    return await this.clientesService.findAuthenticatedUser(userId); // Retorna el cliente autenticado
  }
  @Post('cambiar-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async cambiarPassword(
    @Req() req: any, // Usuario autenticado a través del token JWT
    @Body() body: { passwordActual: string; nuevaPassword: string }, // Campos enviados en el cuerpo
  ) {
    const userId = req.user.id; // ID del usuario autenticado
    const { passwordActual, nuevaPassword } = body;

    // Validar que los campos no estén vacíos
    if (!passwordActual || !nuevaPassword) {
      throw new BadRequestException('Ambas contraseñas son obligatorias.');
    }

    // Llama al servicio para cambiar la contraseña
    return await this.clientesService.cambiarPassword(
      userId,
      passwordActual,
      nuevaPassword,
    );
  }

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
