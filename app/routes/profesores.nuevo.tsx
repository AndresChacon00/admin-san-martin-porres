import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { json, Link, redirect, useFetcher } from '@remix-run/react';
import { addProfesor } from '~/api/controllers/profesores';
import { ChevronLeft } from 'lucide-react';
import { extractEmpleadoFormData } from '~/lib/formData';
import { isRole } from '~/lib/auth';
import EmpleadoForm from '~/components/forms/empleado-form';
import { useRef } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Registrar Profesor | San Martín de Porres' },
    { name: 'description', content: 'Registra un profesor en el sistema' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = extractEmpleadoFormData(formData);
  const response = await addProfesor(data);
  return json(response);
};

export default function CrearProfesor() {
  const fetcher = useFetcher<typeof action>();

  const ref = useRef<HTMLHeadingElement>(null);

  const scrollToTop = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Link
        to='/profesores'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3' ref={ref}>
        Agregar Profesor
      </h1>
      <span className='text-destructive text-sm'>(*) Obligatorio</span>
      <EmpleadoForm fetcher={fetcher} scrollToTop={scrollToTop} />
    </>
  );
}
