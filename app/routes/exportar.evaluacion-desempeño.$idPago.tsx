import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getEvaluacionDesempeñoForExporter } from '~/api/controllers/evaluacionesDesempeño.server';
import { isRole } from '~/lib/auth';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const pagoId = Number(params.idPago);
  if (isNaN(pagoId)) {
    return redirect('/');
  }
  const pagoForExporter = await getEvaluacionDesempeñoForExporter(pagoId);
  return pagoForExporter;
}
