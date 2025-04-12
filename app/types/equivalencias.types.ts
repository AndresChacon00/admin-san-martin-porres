export type TipoPersonal = 'administrativo' | 'instructor';

export type EquivalenciaCargo = {
  id: number;
  cargoId: number;
  codigoCargo: string;
  nivelCargo: string;
  nombreCargo: string;
  nivelId: number;
  nombreNivel: string;
  tipoPersonal: TipoPersonal;
};

export type EquivalenciaNivel = {
  id: number;
  nivelId: number;
  nombreNivel: string;
  minTiempoServicio: number;
  formacionCrecimientoPersonal: string;
};

export type EquivalenciaGrado = {
  id: number;
  gradoId: number;
  nombreGrado: string;
  tituloId: number;
  codTitulo: string;
  nombreTitulo: string;
  experienciaLaboral: number;
  formacionTecnicoProfesional: string;
  tipoPersonal: TipoPersonal;
};
