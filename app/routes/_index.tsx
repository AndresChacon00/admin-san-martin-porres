import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
  addEstudiante,
  deleteEstudiante,
  getEstudiantes,
} from '~/api/controllers/estudiantesController';
import { estudiantes } from '../api/tables/estudiantesSchema';
import Button from '../components/Button';
export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader: LoaderFunction = async () => {
  const students = await getEstudiantes();
  return students;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('_action');
  const id = formData.get('id');

  if (actionType === 'delete' && id != null) {
    await deleteEstudiante(Number(id));
    return null;
  }

  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const cedula = formData.get('cedula') as string;
  const sexo = formData.get('sexo') as string;
  const fechaNacimiento = formData.get('fechaNacimiento') as string;
  const edad = formData.get('edad') as string;
  const religion = formData.get('religion') as string;
  const telefono = formData.get('telefono') as string;
  const correo = formData.get('correo') as string;
  const direccion = formData.get('direccion') as string;
  const ultimoAñoCursado = formData.get('ultimoAñoCursado') as string;

  await addEstudiante(
    nombre,
    apellido,
    cedula,
    sexo,
    new Date(fechaNacimiento),
    Number(edad),
    religion,
    telefono,
    correo,
    direccion,
    ultimoAñoCursado,
  );
  return null;
};

export default function Index() {
  const students = useLoaderData<any[]>();
  const actionData = useActionData<{ error?: string }>();
  return (
    <div>
      <Button />
      <h1>San Martin de Porres</h1>
      <h2>Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.nombre} {student.apellido} ({student.correo})
            <Form method='post' style={{ display: 'inline' }}>
              <input type='hidden' name='id' value={student.id} />
              <button type='submit' name='_action' value='delete'>
                Eliminar
              </button>
            </Form>
          </li>
        ))}
      </ul>
      <h2>Add Student</h2>
      <Form method='post'>
        <div>
          <label>
            Nombre:
            <input type='text' name='nombre' required />
          </label>
        </div>
        <div>
          <label>
            Apellido:
            <input type='text' name='apellido' required />
          </label>
        </div>
        <div>
          <label>
            Cedula:
            <input type='text' name='cedula' required />
          </label>
        </div>
        <div>
          <label>
            Sexo:
            <input type='text' name='sexo' required />
          </label>
        </div>
        <div>
          <label>
            Fecha de Nacimiento:
            <input type='date' name='fechaNacimiento' required />
          </label>
        </div>
        <div>
          <label>
            Edad:
            <input type='number' name='edad' required />
          </label>
        </div>
        <div>
          <label>
            Religion:
            <input type='text' name='religion' required />
          </label>
        </div>
        <div>
          <label>
            Telefono:
            <input type='text' name='telefono' required />
          </label>
        </div>
        <div>
          <label>
            Correo:
            <input type='email' name='correo' required />
          </label>
        </div>
        <div>
          <label>
            Direccion:
            <input type='text' name='direccion' required />
          </label>
        </div>
        <div>
          <label>
            Ultimo Año Cursado:
            <input type='text' name='ultimoAñoCursado' required />
          </label>
        </div>
        {actionData?.error && (
          <p className='text-red-500'>{actionData.error}</p>
        )}
        <button type='submit'>Add Student</button>
      </Form>
    </div>
  );
}
