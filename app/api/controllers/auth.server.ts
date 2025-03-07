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

/**
 * Registers a user with the given information
 * @author gabrielm
 * @param nombre
 * @param email
 * @param password
 * @param adminPassword
 */
export async function createUser(
  nombre: string,
  email: string,
  password: string,
  adminPassword: string,
) {
  try {
    if (adminPassword !== process.env.ADMIN_PASS) {
      throw new Error('Clave de administrador inválida');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .insert(usuarios)
      .values({ nombre, email, password: hashedPassword })
      .execute();

    return { type: 'success', message: 'Usuario creado', _action: 'new-user' };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { type: 'error', message: error.message, _action: 'new-user' };
    }
    return { type: 'error', message: 'Ocurrió un error', _action: 'new-user' };
  }
}

/**
 * Reset a password from admin form
 * @author gabrielm
 * @param email 
 * @param password 
 * @param adminPassword 
 */
export async function resetPassword(
  email: string,
  password: string,
  adminPassword: string,
) {
  try {
    if (adminPassword !== process.env.ADMIN_PASS) {
      throw new Error('Clave de administrador inválida');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(usuarios)
      .set({ password: hashedPassword })
      .where(eq(usuarios.email, email));

    return {
      type: 'success',
      message: 'Contraseña reestablecida',
      _action: 'reset-password',
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return {
        type: 'error',
        message: error.message,
        _action: 'reset-password',
      };
    }
    return {
      type: 'error',
      message: 'Ocurrió un error',
      _action: 'reset-password',
    };
  }
}
