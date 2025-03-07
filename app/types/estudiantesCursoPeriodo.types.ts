import { estudiantesCursoPeriodo } from '~/api/tables/estudiantesCursoPeriodo';

export type EstudianteCursoPeriodoInsert =
  typeof estudiantesCursoPeriodo.$inferInsert;
export type EstudianteCursoPeriodo =
  typeof estudiantesCursoPeriodo.$inferSelect;
