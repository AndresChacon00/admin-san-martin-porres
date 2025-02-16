import { estudiantes } from '~/api/tables/estudiantes';

export type EstudianteInsert = typeof estudiantes.$inferInsert;

export type EstudianteUpdate = Partial<EstudianteInsert>;

export type Estudiante = typeof estudiantes.$inferSelect;
