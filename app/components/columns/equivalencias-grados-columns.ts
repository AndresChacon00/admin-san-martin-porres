import { ColumnDef } from '@tanstack/react-table';
import { EquivalenciaGrado } from '~/types/equivalencias.types';

export const equivalenciasGradosColumns: ColumnDef<EquivalenciaGrado>[] = [
  {
    accessorKey: 'tipoPersonal',
    header: 'Tipo de Personal',
    accessorFn: (row) =>
      row.tipoPersonal[0].toUpperCase() + row.tipoPersonal.slice(1),
    minSize: 800
  },
  {
    accessorKey: 'nombreGrado',
    header: 'Grado',
  },
  {
    accessorKey: 'nombreTitulo',
    header: 'Título',
  },
  {
    accessorKey: 'experienciaLaboral',
    header: 'Experiencia Laboral',
    accessorFn: (row) =>
      row.experienciaLaboral === 0
        ? 'NO REQUIERE'
        : `${row.experienciaLaboral} AÑOS`,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'formacionTecnicoProfesional',
    header: 'Formación Permanente en el Área Técnico Profesional',
    enableColumnFilter: false,
  },
];
