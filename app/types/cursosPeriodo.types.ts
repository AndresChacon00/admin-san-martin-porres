import { cursosPeriodo } from '~/api/tables/cursosPeriodo';

export type CursoPeriodoInsert = typeof cursosPeriodo.$inferInsert;

export type CursoPeriodoUpdate = Partial<CursoPeriodoInsert>;

export type CursoPeriodo = typeof cursosPeriodo.$inferSelect;

export type CursoEnPeriodo = {
  idPeriodo: number;
  codigo: string;
  nombreCurso: string;
  descripcion: string | null;
  estado: number;
  precioTotal: number | null;
};
