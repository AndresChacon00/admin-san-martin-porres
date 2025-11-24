import { json } from '@remix-run/node';
import {
  obtenerNotasCursoPeriodo,
  actualizarNotasCursoPeriodoController,
} from '~/api/controllers/estudiantesCursoPeriodo';

export async function loader({ params }: any) {
  const { idPeriodo, codigo } = params;
  if (!idPeriodo || !codigo)
    return json({ error: 'Parámetros faltantes' }, { status: 400 });

  const notas = await obtenerNotasCursoPeriodo(
    String(idPeriodo),
    String(codigo),
  );
  return json({ notas });
}

export async function action({ request, params }: any) {
  const { idPeriodo, codigo } = params;
  if (!idPeriodo || !codigo)
    return json({ error: 'Parámetros faltantes' }, { status: 400 });

  try {
    const body = await request.json();
    const notas = body?.notas;
    if (!Array.isArray(notas))
      return json({ error: 'Formato inválido' }, { status: 400 });

    const res = await actualizarNotasCursoPeriodoController(
      String(idPeriodo),
      String(codigo),
      notas,
    );
    return json(res);
  } catch (err) {
    console.error('Error en action notas:', err);
    return json({ error: 'Error interno' }, { status: 500 });
  }
}
