import { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { pagosColumns } from '~/components/columns/pagos-nomina-columns';
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

export default function NominaPage() {
  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Pagos de Nómina</h1>
      <Link to='nuevo' className='link-button'>
        Cargar nuevo pago
      </Link>
      <div className='w-4/5 mt-4'>
        <DataTable data={[]} columns={pagosColumns} />
      </div>
    </div>
  );
}
