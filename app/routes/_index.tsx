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
} from '~/api/controllers/estudiantes.server';
import { estudiantes } from '../api/tables/estudiantes';
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
            {student.name} ({student.email})
          </li>
        ))}
      </ul>

      <h2>Add Student</h2>
      <Form method='post'>
        <div>
          <label>
            Name:
            <input type='text' name='name' required />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input type='number' name='age' required />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type='email' name='email' required />
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
