import { pagosEstudiantesCurso } from '~/api/tables/pagosEstudiantesCurso';


export type PagoEstudianteInsert = typeof pagosEstudiantesCurso.$inferInsert;

export type PagoEstudianteUpdate = Partial<PagoEstudianteInsert>;

export type PagoEstudiante = typeof pagosEstudiantesCurso.$inferSelect;
