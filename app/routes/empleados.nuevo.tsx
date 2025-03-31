import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import {
  json,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';
import { addEmpleado } from '~/api/controllers/empleados.server';
import { extractEmpleadoFormData } from '~/lib/formData';
import { isRole } from '~/lib/auth';
import EmpleadoForm from '~/components/forms/empleado-form';
import { useRef } from 'react';
import {
  getEquivalenciasCargos,
  getEquivalenciasGrados,
  getEquivalenciasNiveles,
} from '~/api/controllers/equivalencias.server';

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
  const equivalenciasNiveles = getEquivalenciasNiveles();
  const equivalenciasGrados = getEquivalenciasGrados('administrativo');
  const equivalenciasCargos = getEquivalenciasCargos('administrativo');
  const response = await Promise.all([
    equivalenciasNiveles,
    equivalenciasGrados,
    equivalenciasCargos,
  ]);
  return response;
}

export default function CrearEmpleado() {
  const [equivalenciasNiveles, equivalenciasGrados, equivalenciasCargos] =
    useLoaderData<typeof loader>();

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
      <EmpleadoForm
        fetcher={fetcher}
        scrollToTop={scrollToTop}
        tipoEmpleado='empleados'
        equivalenciasNiveles={equivalenciasNiveles}
        equivalenciasGrados={equivalenciasGrados}
        equivalenciasCargos={equivalenciasCargos}
      />
    </>
  );
}
