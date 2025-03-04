import { cursos } from '~/api/tables/cursos';

export type CursoInsert = typeof cursos.$inferInsert;

export type CursoUpdate = Partial<CursoInsert>;

export type Curso = typeof cursos.$inferSelect;
