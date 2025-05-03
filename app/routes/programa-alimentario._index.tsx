import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useMemo, useEffect } from 'react';
import { getPagosAlimentario } from '~/api/controllers/pagosAlimentario.server';
import { createPagosAlimentarioColumns } from '~/components/columns/pagos-alimentario-columns';
import Paginator from '~/components/Paginator';
import { DataTable } from '~/components/ui/data-table';
import { generarReciboAlimentario } from '~/lib/exporters';
import { PagoAlimentarioExportar } from '~/types/pagosAlimentario.types';

export const meta: MetaFunction = () => {
  return [
    { title: 'Programa Alimentario | San Martín de Porres' },
    {
      name: 'description',
      content: 'Pagos por Programa Alimentario',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('pageSize') || '20';
  const { data, hasMorePages } = await getPagosAlimentario(
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

export default function ProgramaAlimentarioPage() {
  const { pagos, hasMorePages } = useLoaderData<typeof loader>();
  const exportFetcher = useFetcher();

  const columns = useMemo(
    () =>
      createPagosAlimentarioColumns((row) => {
        exportFetcher.load(`/exportar/alimentario/${row.id}`);
      }),
    [],
  );

  useEffect(() => {
    if (exportFetcher.state === 'idle' && exportFetcher.data) {
      generarReciboAlimentario(exportFetcher.data as PagoAlimentarioExportar);
    }
  }, [exportFetcher.state, exportFetcher.data]);

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Pagos del Programa Alimentario</h1>
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
