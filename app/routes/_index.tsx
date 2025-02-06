import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
  addEstudiante,
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
  const name = formData.get('name');
  const age = formData.get('age');
  const email = formData.get('email');

  if (typeof name !== 'string' || typeof email !== 'string') {
    return { error: 'Invalid form data' };
  }

  await addEstudiante(name, Number(age), email);
  return null;
};

export default function Index() {
  const students = useLoaderData<any[]>();
  const actionData = useActionData<{ error?: string }>();
  return (
    <div>
      <Button/>
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
