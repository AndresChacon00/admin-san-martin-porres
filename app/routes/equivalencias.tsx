import { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  getEquivalenciasCargos,
  getEquivalenciasGrados,
  getEquivalenciasNiveles,
} from '~/api/controllers/equivalencias.server';
import { equivalenciasGradosColumns } from '~/components/columns/equivalencias-grados-columns';
import { DataTable as DataTableGrados } from '~/components/data-tables/equivalencias-grados-data-table';
import { DataTable as DataTableCargos } from '~/components/data-tables/equivalencias-cargos-data-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  EquivalenciaCargo,
  EquivalenciaGrado,
  EquivalenciaNivel,
} from '~/types/equivalencias.types';
import { equivalenciasCargosColumns } from '~/components/columns/equivalencias-cargos-columns';

export const meta: MetaFunction = () => {
  return [
    { title: 'Configurar Equivalencias | San Martín de Porres' },
    {
      name: 'description',
      content: 'Configurar equivalencias de niveles, grados y cargos',
    },
  ];
};

export async function loader() {
  const equivalenciasNiveles = getEquivalenciasNiveles();
  const equivalenciasGrados = getEquivalenciasGrados('todos');
  const equivalenciasCargos = getEquivalenciasCargos('todos');
  return await Promise.all([
    equivalenciasNiveles,
    equivalenciasGrados,
    equivalenciasCargos,
  ]);
}

export default function EquivalenciasPage() {
  const [equivalenciasNiveles, equivalenciasGrados, equivalenciasCargos] =
    useLoaderData<typeof loader>();

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Equivalencias</h1>
      <Tabs defaultValue='niveles'>
        <TabsList>
          <TabsTrigger value='niveles'>Niveles</TabsTrigger>
          <TabsTrigger value='grados'>Grados</TabsTrigger>
          <TabsTrigger value='cargos'>Cargos</TabsTrigger>
        </TabsList>

        <NivelesTab equivalenciasNiveles={equivalenciasNiveles} />
        <GradosTab equivalenciasGrados={equivalenciasGrados} />
        <CargosTab equivalenciasCargos={equivalenciasCargos} />
      </Tabs>
    </div>
  );
}

function NivelesTab({
  equivalenciasNiveles,
}: {
  equivalenciasNiveles: EquivalenciaNivel[];
}) {
  return (
    <TabsContent value='niveles'>
      <h2 className='font-bold mt-4'>Equivalencias de Niveles</h2>
      <Table className='w-2/3 mt-2'>
        <TableHeader>
          <TableRow>
            <TableHead>Nivel</TableHead>
            <TableHead>Tiempo Mínimo de Servicio en Centros AVEC</TableHead>
            <TableHead>
              Formación Permanente en el Área de Crecimiento Personal
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equivalenciasNiveles.map((equiv) => (
            <TableRow key={equiv.nivelId}>
              <TableCell className='font-semibold'>
                {equiv.nombreNivel}
              </TableCell>
              <TableCell>{equiv.minTiempoServicio} años</TableCell>
              <TableCell>{equiv.formacionCrecimientoPersonal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
}

function GradosTab({
  equivalenciasGrados,
}: {
  equivalenciasGrados: EquivalenciaGrado[];
}) {
  return (
    <TabsContent value='grados'>
      <h2 className='font-bold mt-4'>Equivalencias de Grados</h2>
      <div className='mt-2 w-4/5'>
        <DataTableGrados
          columns={equivalenciasGradosColumns}
          data={equivalenciasGrados}
        />
      </div>
    </TabsContent>
  );
}

function CargosTab({
  equivalenciasCargos,
}: {
  equivalenciasCargos: EquivalenciaCargo[];
}) {
  return (
    <TabsContent value='cargos'>
      <h2 className='font-bold mt-4'>Equivalencias de Cargos</h2>
      <div className='mt-2 w-4/5'>
        <DataTableCargos
          columns={equivalenciasCargosColumns}
          data={equivalenciasCargos}
        />
      </div>
    </TabsContent>
  );
}
