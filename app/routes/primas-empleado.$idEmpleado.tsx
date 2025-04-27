import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getEmpleadoById } from '~/api/controllers/empleados.server';
import { getAllPrimasForEmpleado } from '~/api/controllers/primas.server';
import { getTituloById } from '~/api/controllers/titulos.server';
import { isRole } from '~/lib/auth';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const empleadoId = Number(params.idEmpleado);
  if (isNaN(empleadoId)) {
    return redirect('/');
  }

  const empleado = await getEmpleadoById(empleadoId);
  if ('type' in empleado) {
    return redirect('/');
  }

  const titulo = await getTituloById(empleado.titulo);

  const primasEmpleado = await getAllPrimasForEmpleado({
    id: empleado.id,
    cedula: empleado.cedula,
    nombre: empleado.nombreCompleto,
    sueldo: empleado.sueldo,
    fechaIngresoAvec: empleado.fechaIngresoAvec,
    titulo: titulo.nombre,
    nivelAcademico: empleado.postgrado,
    hijos: empleado.cantidadHijos,
  });

  return json(primasEmpleado);
}
