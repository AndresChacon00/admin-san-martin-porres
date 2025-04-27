import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { getPagosNomina } from '~/api/controllers/pagosNomina.server';
import { pagosColumns } from '~/components/columns/pagos-nomina-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = searchParams.get('page');

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Pagos de Nómina</h1>
      <Link to='nuevo' className='link-button'>
        Cargar nuevo pago
      </Link>
      <div className='w-4/5 mt-4 flex flex-col'>
        <DataTable data={pagos} columns={pagosColumns} />
        <div className='flex gap-2 mt-3 place-self-end'>
          <Button
            variant='outline'
            disabled={currentPage === '1' || currentPage === null}
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('page', String(Number(currentPage) - 1));
                return prev;
              })
            }
          >
            Anterior
          </Button>
          <Button
            variant='outline'
            disabled={!hasMorePages}
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('page', String(Number(currentPage) + 1));
                return prev;
              })
            }
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
