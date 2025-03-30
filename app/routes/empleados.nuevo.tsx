import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { json, Link, redirect, useFetcher } from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';
import { addEmpleado } from '~/api/controllers/empleados.server';
import { extractEmpleadoFormData } from '~/lib/formData';
import { isRole } from '~/lib/auth';
import EmpleadoForm from '~/components/forms/empleado-form';
import { useRef } from 'react';

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

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }
  return null;
}

export default function CrearEmpleado() {
  const fetcher = useFetcher<typeof action>();

  const ref = useRef<HTMLHeadingElement>(null);

  const scrollToTop = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Link
        to='/empleados'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3' ref={ref}>
        Agregar Empleado
      </h1>
      <span className='text-destructive text-sm'>(*) Obligatorio</span>
      <EmpleadoForm fetcher={fetcher} scrollToTop={scrollToTop} />
    </>
  );
}
