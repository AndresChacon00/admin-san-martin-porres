import db from '../db';
import { estudiantes } from '../tables/estudiantes';

export async function getAllEstudiantes() {
  return await db
    .select({
      cedula: estudiantes.cedula,
      nombre: estudiantes.nombre,
      apellido: estudiantes.apellido,
    })
    .from(estudiantes);
}
