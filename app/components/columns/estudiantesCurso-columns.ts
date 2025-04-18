import { ColumnDef } from '@tanstack/react-table';
import { Estudiante } from '~/types/estudiantes.types';

export const estudiantesCursoColumns: ColumnDef<Estudiante>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'cedula',
    header: 'Cédula',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'apellido',
    header: 'Apellido',
  },
  {
    accessorKey: 'apellido',
    header: 'Apellido',
  },
  {
    id: 'edad',
    header: 'Edad',
    accessorFn: (row) => {
      console.log('fechaNacimiento:', row.fechaNacimiento); // Debugging
      if (!row.fechaNacimiento) return 'N/A';
      const birthDate = new Date(row.fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    },
  },
  {
    accessorKey: 'correo',
    header: 'Correo',
  },

  {
    accessorKey: 'telefono',
    header: 'Teléfono',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  },
];
