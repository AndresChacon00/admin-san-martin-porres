import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node';
import { json, Link, useFetcher } from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';
import { addEmpleado } from '~/api/controllers/empleados.server';
import { extractEmpleadoFormData } from '~/lib/formData';
import EmpleadoForm from '~/components/forms/empleado-form';

export const meta: MetaFunction = () => {
  return [
    { title: 'Registrar Empleado | San Martín de Porres' },
    { name: 'description', content: 'Registra un empleado en el sistema' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = extractEmpleadoFormData(formData);
  const response = await addEmpleado(data);
  return json(response);
};

export default function CrearEmpleado() {
  const fetcher = useFetcher<typeof action>();

  return (
    <>
      <Link
        to='/empleados'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3'>Agregar Empleado</h1>
      <span className='text-destructive text-sm'>(*) Obligatorio</span>
      <EmpleadoForm fetcher={fetcher} />
    </>
  );
}
