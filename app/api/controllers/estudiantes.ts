import { eq } from 'drizzle-orm';
import db from '../db';
import { estudiantes } from '../tables/estudiantes';

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: Date;
  edad: number;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}

export const getEstudiantes = async () => {
  try {
    const estudiantesList = await db
      .select()
      .from(estudiantes)
      .orderBy(estudiantes.id);

    return estudiantesList;
  } catch (error) {
    console.error('Error al obtener a los estudiantes: ', error);
  }
};

export const addEstudiante = async (
  nombre: string,
  apellido: string,
  cedula: string,
  sexo: string,
  fechaNacimiento: Date,
  edad: number,
  religion: string,
  telefono: string,
  correo: string,
  direccion: string,
  ultimoAñoCursado: string,
) => {
  try {
    const newEstudiante = await db
      .insert(estudiantes)
      .values({
        nombre,
        apellido,
        cedula,
        sexo,
        fechaNacimiento,
        edad,
        religion,
        telefono,
        correo,
        direccion,
        ultimoAñoCursado,
      })
      .returning();

    return newEstudiante[0];
  } catch (error) {
    console.error('Error al añadir un estudiante: ', error);
  }
};

export const deleteEstudiante = async (id: number) => {
  try {
    await db.delete(estudiantes).where(eq(estudiantes.id, id));
  } catch (error) {
    console.error('Error al eliminar estudiante: ', error);
  }
};
