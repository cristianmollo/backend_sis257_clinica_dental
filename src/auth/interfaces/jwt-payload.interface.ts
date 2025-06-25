export interface JwtPayload {
  sub: number; // ID del usuario
  role: 'odontologo' | 'cliente'; // Rol del usuario
}