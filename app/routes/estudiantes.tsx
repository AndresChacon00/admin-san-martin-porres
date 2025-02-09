import { useLoaderData, MetaFunction } from '@remix-run/react';
import { getEstudiantes } from '~/api/controllers/estudiantes';

export const meta: MetaFunction = () => {
  return [{ title: 'Estudiantes | San Matín de Porres' }];
};

export async function loader() {
  const data = await getEstudiantes();
  return data;
}

export default function EstudiantesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Estudiantes</h1>
    </>
  );
}
