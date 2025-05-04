import { LoaderFunction, MetaFunction, ActionFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { getEscalaSueldoPersonal, updateEscalaSueldoPersonal } from '~/api/controllers/escalaSueldoPersonal.server';
import { EscalaSueldoPersonal } from '~/types/escalaSueldoPersonal.types';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [
    { title: 'Escala de Sueldos | San Martín de Porres' },
    {
      name: 'description',
      content: 'Configurar la escala de sueldos del personal',
    },
  ];
};

// Loader para obtener los datos del backend
export const loader: LoaderFunction = async () => {
  const escalaSueldo = await getEscalaSueldoPersonal('todos');
  return escalaSueldo;
};

// Action para manejar las actualizaciones
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get('id');
  const escalaSueldo = formData.get('escalaSueldo');
  const actionType = formData.get('_action');

  if (actionType === 'update-sueldo') {
    if (!id || !escalaSueldo) {
      return { type: 'error', message: 'Datos incompletos' };
    }

    try {
      const updated = await updateEscalaSueldoPersonal(Number(id), {
        escalaSueldo: Number(escalaSueldo),
      });
      return { type: 'success', message: 'Sueldo actualizado correctamente', data: updated };
    } catch (error) {
      return { type: 'error', message: 'Error al actualizar el sueldo' };
    }
  }

  return { type: 'error', message: 'Acción no válida' };
};

type FetcherData = {
  type: 'success' | 'error';
  message: string;
};

export default function EscalaSueldoPersonalPage() {
  const escalaSueldo = useLoaderData<EscalaSueldoPersonal[]>();
  const fetcher = useFetcher<FetcherData>();
  const [editingCell, setEditingCell] = useState<EscalaSueldoPersonal | null>(null);

  // Grados y niveles
  const grados = ['B1', 'B2', 'B3', 'T1', 'T2', 'P1', 'P2', 'P3'];
  const niveles = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // Filtrar datos por tipo de personal
  const administrativos = escalaSueldo.filter((row) => row.tipoPersonal === 'administrativo');
  const instructores = escalaSueldo.filter((row) => row.tipoPersonal === 'instructor');

  // Organizar los datos en una estructura de tabla
  const createTableData = (data: EscalaSueldoPersonal[]) =>
    grados.map((grado, gradoIndex) =>
      niveles.map((_, nivelIndex) => {
        return data.find(
          (row) => row.grado === gradoIndex + 1 && row.nivel === nivelIndex + 1
        );
      })
    );

  const tableDataAdministrativos = createTableData(administrativos);
  const tableDataInstructores = createTableData(instructores);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.type === 'success') {
        toast.success(fetcher.data.message);
        setEditingCell(null);
      } else if (fetcher.data.type === 'error') {
        toast.error(fetcher.data.message);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleEdit = (cell: EscalaSueldoPersonal) => {
    setEditingCell(cell);
  };

  const renderTable = (tableData: (EscalaSueldoPersonal | undefined)[][]) => (
    <Table className="w-full border-collapse">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-bold">Grado / Nivel</TableHead>
          {niveles.map((nivel, i) => (
            <TableHead key={i} className="text-center font-bold">
              {nivel}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row, gradoIndex) => (
          <TableRow key={gradoIndex}>
            <TableCell scope="row" className="font-bold text-center">
              {grados[gradoIndex]}
            </TableCell>
            {row.map((cell, nivelIndex) => (
              <TableCell key={nivelIndex} className="text-center">
                {cell ? (
                  <>
                    {cell.escalaSueldo}
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleEdit(cell)}
                    >
                      Editar
                    </Button>
                  </>
                ) : (
                  'N/A'
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="pb-8">
      <h1 className="text-xl font-bold mb-4">Escala de Sueldos del Personal</h1>
      <Tabs defaultValue="administrativos">
        <TabsList>
          <TabsTrigger value="administrativos">Administrativos</TabsTrigger>
          <TabsTrigger value="instructores">Instructores</TabsTrigger>
        </TabsList>

        <TabsContent value="administrativos">
          <h2 className="font-bold mt-4">Personal Administrativo</h2>
          {renderTable(tableDataAdministrativos)}
        </TabsContent>

        <TabsContent value="instructores">
          <h2 className="font-bold mt-4">Personal Instructores</h2>
          {renderTable(tableDataInstructores)}
        </TabsContent>
      </Tabs>

      {/* Dialog para editar */}
      <Dialog open={!!editingCell} onOpenChange={() => setEditingCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Escala de Sueldo</DialogTitle>
          </DialogHeader>
          {editingCell && (
            <fetcher.Form method="post" className="space-y-4">
              <input type="hidden" name="_action" value="update-sueldo" />
              <input type="hidden" name="id" value={editingCell.id} />
              <p>
                <b>Nivel:</b> {editingCell.nivel}
              </p>
              <p>
                <b>Grado:</b> {editingCell.grado}
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Escala de Sueldo
                </label>
                <Input
                  type="number"
                  name="escalaSueldo"
                  defaultValue={editingCell.escalaSueldo}
                  placeholder="Ingrese el sueldo"
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar Cambios
              </Button>
            </fetcher.Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}