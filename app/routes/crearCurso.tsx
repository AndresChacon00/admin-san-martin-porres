import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { addCurso, getCursos } from '../api/controllers/cursos';
import Button from '../components/Button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cursos | San Martín de Porres' },
    { name: 'description', content: 'Gestión de cursos' },
  ];
};

export const loader: LoaderFunction = async () => {
  const cursos = await getCursos();
  return cursos;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const codigo = formData.get('codigo');
  const nombreCurso = formData.get('nombreCurso');
  const descripcion = formData.get('descripcion');
  const horario = formData.get('horario');
  const estado = Number(formData.get('estado'));
  const precioTotal = Number(formData.get('precioTotal'));

  if (
    typeof codigo !== 'string' ||
    typeof nombreCurso !== 'string' ||
    typeof descripcion !== 'string' ||
    typeof horario !== 'string' ||
    isNaN(estado) ||
    isNaN(precioTotal)
  ) {
    return { error: 'Datos del formulario inválidos' };
  }

  await addCurso({
    codigo,
    nombreCurso,
    descripcion,
    horario,
    estado,
    precioTotal,
  });

  return null;
};

export default function CrearCurso() {
  const cursos = useLoaderData<any[]>();
  const actionData = useActionData<{ error?: string }>();

  return (
    <div>
      <Button />
      <h1>San Martín de Porres</h1>
      <h2>Cursos</h2>
      <ul>
        {cursos.map((curso) => (
          <li key={curso.codigo}>
            {curso.nombreCurso} ({curso.codigo})
          </li>
        ))}
      </ul>

      <h2>Agregar Curso</h2>
      <Form method="post">
        <div>
          <label>
            Código:
            <input type="text" name="codigo" required />
          </label>
        </div>
        <div>
          <label>
            Nombre del Curso:
            <input type="text" name="nombreCurso" required />
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <textarea name="descripcion" required />
          </label>
        </div>
        <div>
          <label>
            Horario:
            <input type="text" name="horario" required />
          </label>
        </div>
        <div>
          <label>
            Estado:
            <select name="estado" required>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Precio Total:
            <input type="number" step="0.01" name="precioTotal" required />
          </label>
        </div>
        {actionData?.error && <p>{actionData.error}</p>}
        <button type="submit">Agregar Curso</button>
      </Form>
    </div>
  );
}
