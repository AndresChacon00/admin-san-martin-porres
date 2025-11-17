import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { getAllSueldosYSalarios, setSueldoYSalario } from '../services/sueldos-y-salarios.server';
import { isRole } from '~/lib/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return json({ error: 'No autorizado' }, { status: 403 });
  }
  const sueldosYSalarios = await getAllSueldosYSalarios();
  return json({ sueldosYSalarios });
}

export async function action({ request }: ActionFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return json({ error: 'No autorizado' }, { status: 403 });
  }
  const formData = await request.formData();
  const sueldoMinimo = Number(formData.get('sueldo_minimo'));
  const salarioIntegral = Number(formData.get('salario_integral'));
  await setSueldoYSalario('sueldo_minimo', sueldoMinimo);
  await setSueldoYSalario('salario_integral', salarioIntegral);
  return json({ success: true });
}
