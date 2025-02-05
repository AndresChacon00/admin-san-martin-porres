import db from '../db';
import { estudiantes } from '../tables/estudiantes';

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
  name: string,
  age: number,
  email: string,
) => {
  try {
    const newEstudiante = await db
      .insert(estudiantes)
      .values({ name, age, email })
      .returning();

    return newEstudiante[0];
  } catch (error) {
    console.error('Error al añadir un estudiante: ', error);
  }
};
