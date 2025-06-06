import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getPagoNominaForExporter } from '~/api/controllers/pagosNomina.server';
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
  const pagoForExporter = await getPagoNominaForExporter(pagoId);
  return pagoForExporter;
}
