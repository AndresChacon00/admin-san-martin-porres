import {
  useLoaderData,
  MetaFunction,
  Form,
  redirect,
  useActionData,
} from '@remix-run/react';
import {
  addEstudiante,
  deleteEstudiante,
  getEstudiantes,
  updateEstudiante,
} from '~/api/controllers/estudiantes.server';
import { estudiantesColumns } from '~/components/columns/estudiantes-columns';
import { DataTable } from '~/components/ui/data-table';
import { ActionFunction , json } from '@remix-run/node';
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
  const formData = await request.formData();
  const actionType = formData.get('actionType');

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
      return json({ error: 'Datos inválidos' }, { status: 400 });
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
      console.log('ERRORRRRcito', result.message);
      return json({ error: result.message }, { status: 400 });
    }
  }

  if (actionType === 'editar') {
    const id = formData.get('id');

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
      typeof id !== 'string' ||
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
      return json({ error: 'Datos inválidos' }, { status: 400 });
    }
    const result = await updateEstudiante(parseInt(id), {
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
      console.log('ERRORRRRcito', result.message);
      return json({ error: result.message }, { status: 400 });
    }
  }

  if (actionType === 'eliminar') {
    const id = formData.get('id');

    if (typeof id !== 'string') {
      return json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await deleteEstudiante(parseInt(id));
    if ('type' in result && result.type === 'error') {
      console.log('ERRORRRRcito', result.message);
      return json({ error: result.message }, { status: 400 });
    }
  }

  return redirect('/estudiantes');
};

export default function EstudiantesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Estudiantes</h1>
      <div className="py-4 w-3/4">
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
