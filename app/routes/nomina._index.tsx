import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useMemo, useEffect } from 'react';
import { getPagosNomina } from '~/api/controllers/pagosNomina.server';
import { createPagosColumns } from '~/components/columns/pagos-nomina-columns';
import Paginator from '~/components/Paginator';
import { DataTable } from '~/components/ui/data-table';
import { generarReciboNomina } from '~/lib/exporters';
import { PagoNominaExportar } from '~/types/pagosNomina.types';

export const meta: MetaFunction = () => {
  return [
    { title: 'Nómina | San Martín de Porres' },
    {
      name: 'description',
      content: 'Nómina de empleados',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('pageSize') || '20';
  const { data, hasMorePages } = await getPagosNomina(
    Number(page),
    Number(pageSize),
  );
  return {
    pagos: data.map((pago) => ({
      ...pago,
      fecha: pago.fecha.toLocaleDateString('es-VE'),
    })),
    hasMorePages,
  };
}

export default function NominaPage() {
  const { pagos, hasMorePages } = useLoaderData<typeof loader>();
  const exportFetcher = useFetcher();

  const columns = useMemo(
    () =>
      createPagosColumns((row) => {
        exportFetcher.load(`/exportar/nomina/${row.id}`);
      }),
    [],
  );

  useEffect(() => {
    if (exportFetcher.state === 'idle' && exportFetcher.data) {
      generarReciboNomina(exportFetcher.data as PagoNominaExportar);
    }
  }, [exportFetcher.state, exportFetcher.data]);

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Pagos de Nómina</h1>
      <Link to='nuevo' className='link-button'>
        Cargar nuevo pago
      </Link>
      <div className='lg:w-4/5 mt-4 flex flex-col'>
        <DataTable data={pagos} columns={columns} />
        <Paginator hasMorePages={hasMorePages} />
      </div>
    </div>
  );
}
