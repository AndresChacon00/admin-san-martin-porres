export type TipoPersonal = 'administrativo' | 'instructor';

export interface EscalaSueldoPersonal {
  id: number;
  nivel: number;
  grado: number;
  tipoPersonal: TipoPersonal;
  escalaSueldo: number;
}