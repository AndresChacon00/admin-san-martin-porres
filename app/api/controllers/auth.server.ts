import { eq } from 'drizzle-orm';
import db from '../db';
import { usuarios } from '../tables/usuarios';
import bcrypt from 'bcryptjs';

/**
 * Log user in with email and password
 * @author gabrielm
 * @param email
 * @param password
 */
export async function login(email: string, password: string) {
  try {
    const usuario = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));

    if (usuario.length === 0) {
      throw new Error('Correo o contraseña inválidos');
    }

    const validPassword = await bcrypt.compare(password, usuario[0].password);
    if (!validPassword) {
      throw new Error('Correo o contraseña inválidos');
    }

    return usuario[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
}
