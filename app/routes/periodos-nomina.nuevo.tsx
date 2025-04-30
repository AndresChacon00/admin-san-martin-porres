import { ActionFunctionArgs } from '@remix-run/node';
import { createPeriodoNomina } from '~/api/controllers/periodosNomina.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nombre = formData.get('nombre');
  if (!nombre) {
    return { type: 'error', message: 'Rellene todos los campos' };
  }
  return await createPeriodoNomina({ nombre: String(nombre) });
}
