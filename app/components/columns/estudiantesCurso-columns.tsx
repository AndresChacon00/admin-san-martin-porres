
import { ColumnDef } from '@tanstack/react-table';
import { Estudiante } from '~/types/estudiantes.types';
import {ArrowUpDown} from 'lucide-react';
import { Button } from '../ui/button';
export const estudiantesCursoColumns: ColumnDef<Estudiante>[] = [
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
    accessorKey: "deuda",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deuda
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
