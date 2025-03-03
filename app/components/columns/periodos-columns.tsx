
import { ColumnDef } from "@tanstack/react-table";

import { Link } from "@remix-run/react";

import { Button } from "../ui/button";


import { Periodo } from "~/types/periodos.types";

export const periodosColumns: ColumnDef<Periodo>[] = [
  {
    accessorKey: "idPeriodo",
    header: "ID Periodo",
  },
  {
    accessorKey: "fechaInicio",
    header: "Fecha de Inicio",
    accessorFn: (row) => new Date(row.fechaInicio).toLocaleDateString(),
  },
  {
    accessorKey: "fechaFin",
    header: "Fecha de Fin",
    accessorFn: (row) => new Date(row.fechaFin).toLocaleDateString(),
  },
   {
  header: 'Acciones',
  cell: ({ row }) => (
    <Link to={`/periodos/${row.original.idPeriodo}`}>
      <Button variant="outline">Ver Cursos</Button>
    </Link>
  ),
}
];
