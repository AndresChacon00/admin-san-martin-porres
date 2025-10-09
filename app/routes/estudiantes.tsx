import {
  useLoaderData,
  MetaFunction,
  Form,
  redirect,
  useActionData,
  useFetcher,
  useRevalidator,
} from '@remix-run/react';
import { useEffect } from 'react';
import {
  addEstudiante,
  deleteEstudiante,
  getEstudiantes,
  updateEstudiante,
} from '~/api/controllers/estudiantes.server';
import { estudiantesColumns } from '~/components/columns/estudiantes-columns';
import { ActionFunction, json } from '@remix-run/node';
import { AgregarEstudianteModal } from '~/components/crud/AgregarEstudianteModal';

import { DataTableEstudiantes } from '~/components/data-tables/estudiantes-data-table';

export const meta: MetaFunction = () => {
  return [{ title: 'Estudiantes | San Matín de Porres' }];
};

export async function loader() {
  const data = await getEstudiantes();
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const accept = request.headers.get('accept') || '';
    const xreq = request.headers.get('x-requested-with') || '';
    const wantsJson = accept.includes('application/json') || xreq === 'XMLHttpRequest';

    if (actionType === 'agregar') {
    const nombre = formData.get('nombre');
    const apellido = formData.get('apellido');
    const cedula = formData.get('cedula');
    const sexo = formData.get('sexo');
    const fechaNacimiento = formData.get('fechaNacimiento');
    const edad = formData.get('edad');
    const religion = formData.get('religion');
    const telefono = formData.get('telefono');
    const correo = formData.get('correo');
    const direccion = formData.get('direccion');
    const ultimoAñoCursado = formData.get('ultimoAñoCursado');

    if (
      typeof nombre !== 'string' ||
      typeof apellido !== 'string' ||
      typeof cedula !== 'string' ||
      typeof sexo !== 'string' ||
      typeof fechaNacimiento !== 'string' ||
      typeof edad !== 'string' ||
      typeof religion !== 'string' ||
      typeof telefono !== 'string' ||
      typeof correo !== 'string' ||
      typeof direccion !== 'string' ||
      typeof ultimoAñoCursado !== 'string'
    ) {
      return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
    }

    const result = await addEstudiante({
      nombre,
      apellido,
      cedula,
      sexo,
      fechaNacimiento: new Date(fechaNacimiento),
      edad: Number(edad),
      religion,
      telefono,
      correo,
      direccion,
      ultimoAñoCursado,
    });

    if ('type' in result && result.type === 'error') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('ERRORRRRcito', (result as any)?.message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Response(JSON.stringify({ type: 'error', message: (result as any)?.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          'X-Error-Message': String((result as any)?.message),
        },
      });
    }
    if (wantsJson) return json({ type: 'success', message: 'Estudiante agregado' });
  }

  if (actionType === 'editar') {
    const nombre = formData.get('nombre');
    const apellido = formData.get('apellido');
    const cedula = formData.get('cedula');
    const sexo = formData.get('sexo');
    const fechaNacimiento = formData.get('fechaNacimiento');
    const edad = formData.get('edad');
    const religion = formData.get('religion');
    const telefono = formData.get('telefono');
    const correo = formData.get('correo');
    const direccion = formData.get('direccion');
    const ultimoAñoCursado = formData.get('ultimoAñoCursado');

    if (
      typeof nombre !== 'string' ||
      typeof apellido !== 'string' ||
      typeof cedula !== 'string' ||
      typeof sexo !== 'string' ||
      typeof fechaNacimiento !== 'string' ||
      typeof edad !== 'string' ||
      typeof religion !== 'string' ||
      typeof telefono !== 'string' ||
      typeof correo !== 'string' ||
      typeof direccion !== 'string' ||
      typeof ultimoAñoCursado !== 'string'
    ) {
      return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
    }
    const result = await updateEstudiante(cedula, {
      nombre,
      apellido,
      cedula,
      sexo,
      fechaNacimiento: new Date(fechaNacimiento),
      edad: Number(edad),
      religion,
      telefono,
      correo,
      direccion,
      ultimoAñoCursado,
    });

    if ('type' in result && result.type === 'error') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('ERRORRRRcito', (result as any)?.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Response(JSON.stringify({ type: 'error', message: (result as any)?.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'X-Error-Message': String((result as any)?.message),
          },
        });
    }
    if (wantsJson) return json({ type: 'success', message: 'Estudiante actualizado' });
  }

  if (actionType === 'eliminar') {
    const cedula = formData.get('cedula');

    if (typeof cedula !== 'string') {
      return json({ type: 'error', message: 'Cedula inválida' }, { status: 400 });
    }

    const result = await deleteEstudiante(cedula);
    if ('type' in result && result.type === 'error') {
      console.log('ERRORRRRcito', result.message);
        return new Response(JSON.stringify({ type: 'error', message: result.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Error-Message': String(result.message),
          },
        });
    }
    if (wantsJson) return json({ type: 'success', message: 'Estudiante eliminado' });
  }
    return redirect('/estudiantes');
  } catch (err: unknown) {
    // Catch any unexpected error and return JSON so the client doesn't get HTML
    // Log the error server-side for debugging
    console.error('Unhandled error in estudiantes action:', err);
    const msg = err instanceof Error ? err.message : String(err);
  const raw = (err as unknown as { raw?: string })?.raw || '';
    return new Response(JSON.stringify({ type: 'error', message: msg, raw }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Error-Message': msg,
        'X-Raw-Error': raw,
      },
    });
  }
};

export default function EstudiantesPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  // Listen for custom refresh events so child modals can ask the page to reload
  useEffect(() => {
    const handler = () => {
      fetcher.load(window.location.pathname);
      try {
        revalidator.revalidate();
      } catch (_) {
        // ignore if revalidator is not functional in this environment
      }
    };
    window.addEventListener('refreshEstudiantes', handler);
    return () => window.removeEventListener('refreshEstudiantes', handler);
  }, [fetcher, revalidator]);

  return (
    <>
      <h1 className='text-xl font-bold'>Estudiantes</h1>
      <div className='py-4 w-3/4'>
        <AgregarEstudianteModal />

        <main className='py-4'>
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && (
            <DataTableEstudiantes columns={estudiantesColumns} data={data} />
          )}
        </main>
      </div>
    </>
  );
}
