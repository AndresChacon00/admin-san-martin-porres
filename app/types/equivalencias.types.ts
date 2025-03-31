export type EquivalenciaCargo = {
  cargoId: number;
  nombreCargo: string;
  nivelId: number;
  nombreNivel: string;
};

export type EquivalenciaNivel = {
  nivelId: number;
  nombreNivel: string;
  minTiempoServicio: number;
  formacionCrecimientoPersonal: string;
};

export type EquivalenciaGrado = {
  gradoId: number;
  nombreGrado: string;
  tituloId: number;
  codTitulo: string;
  nombreTitulo: string;
  experienciaLaboral: number;
  formacionTecnicoProfesional: string;
};
